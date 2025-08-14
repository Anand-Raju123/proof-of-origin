import React, { useState, useCallback, useEffect } from 'react';
import { Document } from '@/entities/Document';
import { UploadFile, InvokeLLM } from '@/integrations/Core';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Shield, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom"; 
import { createPageUrl } from "@/utils";

import DuplicateDetection from "@/components/upload/DuplicateDetection";
import VerificationProgress from "@/components/verification/VerificationProgress";

export default function UploadPage() {
  const navigate = useNavigate();
  const [connectedWallet, setConnectedWallet] = useState(null); // New state for wallet connection
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [duplicateDocument, setDuplicateDocument] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [ipfsProgress, setIpfsProgress] = useState(0);
  const [blockchainProgress, setBlockchainProgress] = useState(0);

  // Check wallet connection on component mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (!savedWallet) {
      // Redirect to home if no wallet connected
      navigate(createPageUrl("Home"));
      return;
    }
    setConnectedWallet(JSON.parse(savedWallet));
  }, [navigate]);

  const calculateFileHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const checkForDuplicates = async (fileHash) => {
    const existingDocuments = await Document.filter({ file_hash: fileHash });
    return existingDocuments.length > 0 ? existingDocuments[0] : null;
  };

  const generateIPFSHash = async (file) => {
    // Simulate IPFS upload process
    setIpfsProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setIpfsProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Generate a mock IPFS hash based on file content
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Format as IPFS hash (Qm... format)
      const ipfsHash = `Qm${hash.substring(0, 44)}`;

      clearInterval(progressInterval);
      setIpfsProgress(100);

      return ipfsHash;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  };

  const storeOnBlockchain = async (ipfsHash, documentId) => {
    setBlockchainProgress(0);

    // Simulate blockchain transaction
    const progressInterval = setInterval(() => {
      setBlockchainProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 300);

    try {
      // In a real implementation, this would interact with Aptos blockchain
      // For now, we'll simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a mock transaction ID
      const txId = `0x${Math.random().toString(16).substring(2, 66)}`;

      clearInterval(progressInterval);
      setBlockchainProgress(100);

      return txId;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  };

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  }, [title]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  }, [title]);

  const handleUpload = async () => {
    if (!selectedFile || !title) return;

    setIsUploading(true);

    try {
      // Step 1: Calculate file hash and check for duplicates
      const fileHash = await calculateFileHash(selectedFile);
      const duplicate = await checkForDuplicates(fileHash);

      if (duplicate) {
        setDuplicateDocument(duplicate);
        setIsUploading(false);
        return;
      }

      // Step 2: Upload file
      const { file_url } = await UploadFile({ file: selectedFile });

      // Step 3: Create initial document record
      const docData = {
        title,
        description,
        file_url,
        file_hash: fileHash,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        verification_status: 'pending'
      };

      const document = await Document.create(docData);
      setCurrentDocument(document);

      // Step 4: Generate IPFS hash
      const ipfsHash = await generateIPFSHash(selectedFile);
      await Document.update(document.id, {
        ipfs_hash: ipfsHash,
        verification_status: 'ipfs_uploaded'
      });

      setCurrentDocument(prev => ({
        ...prev,
        ipfs_hash: ipfsHash,
        verification_status: 'ipfs_uploaded'
      }));

      // Step 5: Store on blockchain
      const txId = await storeOnBlockchain(ipfsHash, document.id);
      await Document.update(document.id, {
        blockchain_tx_id: txId,
        verification_status: 'blockchain_verified'
      });

      setCurrentDocument(prev => ({
        ...prev,
        blockchain_tx_id: txId,
        verification_status: 'blockchain_verified'
      }));

      // Navigate to dashboard after successful upload
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      if (currentDocument) {
        await Document.update(currentDocument.id, {
          verification_status: 'failed'
        });
      }
    }

    setIsUploading(false);
  };

  // Don't render upload form if no wallet connected
  if (!connectedWallet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Wallet Required</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to upload documents</p>
          <Link to={createPageUrl("Home")}>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Upload Document
          </h1>
          <p className="text-gray-400">
            Secure your documents with blockchain verification and IPFS storage
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Document Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file" className="text-gray-300">Select File</Label>
                  <div
                    className="mt-2 border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    <input
                      id="file-input"
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                    {selectedFile ? (
                      <div className="space-y-2">
                        <FileText className="w-12 h-12 mx-auto text-blue-400" />
                        <p className="text-white font-medium">{selectedFile.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 mx-auto text-gray-500" />
                        <p className="text-gray-300">Drop files here or click to browse</p>
                        <p className="text-gray-500 text-sm">
                          Supports PDF, DOC, DOCX, JPG, PNG, TXT
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="title" className="text-gray-300">Document Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter document title"
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add description..."
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !title || isUploading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Secure & Verify Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            {currentDocument && (
              <VerificationProgress
                document={currentDocument}
                ipfsProgress={ipfsProgress}
                blockchainProgress={blockchainProgress}
              />
            )}
          </div>
        </div>

        <AnimatePresence>
          {duplicateDocument && (
            <DuplicateDetection
              duplicateDocument={duplicateDocument}
              onProceed={() => {
                setDuplicateDocument(null);
                // Continue with upload anyway (if needed)
              }}
              onCancel={() => {
                setDuplicateDocument(null);
                setSelectedFile(null);
                setTitle('');
                setDescription('');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
