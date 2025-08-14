import React, { useState, useEffect } from 'react';
import { Document } from '@/entities/Document';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Clock, CheckCircle, Filter, Plus, Eye, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import WalletConnection from "@/components/wallet/WalletConnection";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [sortBy, setSortBy] = useState('created_date');

  useEffect(() => {
    loadDocuments();
  }, [sortBy]);

  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      setConnectedWallet(JSON.parse(savedWallet));
    }
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await Document.list(`-${sortBy}`, 50);
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
    setIsLoading(false);
  };

  const handleWalletConnect = (walletData) => {
    setConnectedWallet(walletData);
    if (walletData) {
      localStorage.setItem('connectedWallet', JSON.stringify(walletData));
    } else {
      localStorage.removeItem('connectedWallet');
    }
  };

  const handleSort = () => {
    setSortBy(prev => prev === 'created_date' ? 'updated_date' : 'created_date');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'blockchain_verified': return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'ipfs_uploaded': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-900/30 text-red-400 border-red-500/30';
      default: return 'bg-gray-800 text-gray-400 border-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'blockchain_verified': return CheckCircle;
      case 'ipfs_uploaded': return Shield;
      case 'pending': return Clock;
      default: return FileText;
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-3">
              Your Secure Document Vault
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
              Oversee all your verified documents. Each file is secured with an IPFS hash and recorded on the Aptos blockchain for immutable proof of existence.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Wallet Connection Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <WalletConnection 
              onWalletConnect={handleWalletConnect}
              connectedWallet={connectedWallet}
            />
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Documents</p>
                    <p className="text-2xl font-bold text-white">{documents.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Verified</p>
                    <p className="text-2xl font-bold text-white">
                      {documents.filter(doc => doc.verification_status === 'blockchain_verified').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-white">
                      {documents.filter(doc => doc.verification_status === 'pending' || doc.verification_status === 'ipfs_uploaded').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Documents</h2>
              <div className="flex items-center gap-4">
                {connectedWallet && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>Wallet Connected</span>
                  </div>
                )}
                <Button
                  onClick={handleSort}
                  variant="outline" 
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {sortBy === 'created_date' ? 'Newest First' : 'Recently Updated'}
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-700 rounded w-3/4" />
                        <div className="h-3 bg-gray-700 rounded w-1/2" />
                        <div className="h-6 bg-gray-700 rounded w-1/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : documents.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Documents Yet</h3>
                  <p className="text-gray-400 mb-6">Upload your first document to get started with blockchain verification</p>
                  <Link to={createPageUrl("Upload")}>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload First Document
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {documents.map((document, index) => {
                    const StatusIcon = getStatusIcon(document.verification_status);
                    return (
                      <motion.div
                        key={document.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 group">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">
                                  {document.title}
                                </CardTitle>
                                {document.description && (
                                  <p className="text-gray-400 text-sm line-clamp-2">
                                    {document.description}
                                  </p>
                                )}
                              </div>
                              <StatusIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <Badge className={getStatusColor(document.verification_status)}>
                                {document.verification_status.replace('_', ' ')}
                              </Badge>
                              
                              <div className="text-sm text-gray-400">
                                <p>Uploaded {format(new Date(document.created_date), 'MMM d, yyyy')}</p>
                                {document.file_size && (
                                  <p>{(document.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                )}
                              </div>

                              {document.ipfs_hash && (
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">IPFS Hash</p>
                                  <p className="text-xs text-gray-300 font-mono bg-gray-800 p-2 rounded break-all">
                                    {document.ipfs_hash.substring(0, 20)}...
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                                  onClick={() => window.open(document.file_url, '_blank')}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
