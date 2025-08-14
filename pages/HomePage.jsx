import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Globe, CheckCircle, ArrowRight, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import WalletConnection from "@/components/wallet/WalletConnection";

export default function HomePage() {
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [showWalletSection, setShowWalletSection] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('connectedWallet');
      if (saved) setConnectedWallet(JSON.parse(saved));
    } catch { /* ignore parse errors */ }
  }, []);

  const handleWalletConnect = (walletData) => {
    setConnectedWallet(walletData);
    if (walletData) {
      localStorage.setItem('connectedWallet', JSON.stringify(walletData));
      setShowWalletSection(false); // hide the connect panel once connected
    } else {
      localStorage.removeItem('connectedWallet');
      setShowWalletSection(true); // re-open panel on disconnect if you want
    }
  };

  const features = [
    { icon: Shield, title: "Blockchain Security", description: "Immutable proof on Aptos blockchain" },
    { icon: Lock,   title: "IPFS Storage",        description: "Decentralized files with integrity" },
    { icon: Globe,  title: "Global Verification", description: "Verify from anywhere transparently" },
    { icon: CheckCircle, title: "Instant Proof",  description: "Immediate cryptographic assurance" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                ChainProof
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Secure Document Verification with Blockchain Technology
            </p>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              Protect your documents with immutable blockchain records and IPFS storage.
            </p>

            {!connectedWallet ? (
              <div className="space-y-6">
                <Button
                  onClick={() => setShowWalletSection(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-lg px-8 py-3"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet to Get Started
                </Button>
                <p className="text-sm text-gray-500">
                  Connect your Petra wallet to start securing your documents
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="text-green-400 font-medium">Wallet Connected</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to={createPageUrl("Upload")}>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-lg px-8 py-3">
                      Start Uploading Documents
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Dashboard")}>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 text-lg px-8 py-3">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Wallet Connection Section - will show after button click until connected */}
      {showWalletSection && !connectedWallet && (
        <section className="py-12 bg-gray-900/50">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <WalletConnection onWalletConnect={handleWalletConnect} connectedWallet={connectedWallet} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose ChainProof?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Advanced blockchain tech with a friendly UX</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                    <p className="text-gray-400">{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
