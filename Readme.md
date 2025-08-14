# Proof of Origin

## Team Name
[ImpactLoop]




## Project Description

There is no universal, tamper-proof system to prove the original creator and creation time of digital content. As a result, articles, images, videos, and other works are easily stolen, reposted, or falsely claimed by others. Current copyright methods are slow, centralized, and geographically limited, failing to protect creators in the fast-paced, global digital space. Without a secure mechanism for creators to store their work with an immutable digital signature, plagiarism continues unchecked, trust in online content erodes, and creative innovation is discouraged.

Our solution leverages blockchain technology to create a decentralized, immutable, and globally accessible system that empowers digital content creators to establish indisputable proof of ownership and creation time for their work.

## Smart Contract Details

### Contract Overview
The Proof of Origin smart contract is built on the Aptos blockchain and provides a decentralized solution for content creators to register and verify the authenticity of their digital works.

### Key Functions

#### 1. `register_content`
```move
public fun register_content(
    creator: &signer, 
    content_hash: String, 
    title: String, 
    content_type: String
)
```
- **Purpose**: Registers new digital content and establishes proof of origin
- **Parameters**:
  - `creator`: The signer (content creator)
  - `content_hash`: Unique hash of the digital content
  - `title`: Title or name of the content
  - `content_type`: Type of content (image, video, article, etc.)
- **Functionality**: Creates an immutable record with timestamp and creator information

#### 2. `verify_content_origin`
```move
public fun verify_content_origin(content_hash: String, claimed_creator: address): (bool, u64)
```
- **Purpose**: Verifies the authenticity and ownership of digital content
- **Parameters**:
  - `content_hash`: Hash of the content to verify
  - `claimed_creator`: Address of the claimed creator
- **Returns**: 
  - `bool`: Whether the content is authentic
  - `u64`: Creation timestamp

### Data Structures

#### ContentRecord
```move
struct ContentRecord has store, key {
    content_hash: String,      // Hash of the digital content
    creator: address,          // Address of the original creator
    creation_timestamp: u64,   // Timestamp when content was registered
    title: String,             // Title or name of the content
    content_type: String,      // Type of content
}
```

#### CreatorRegistry
```move
struct CreatorRegistry has store, key {
    content_ids: vector<String>,  // List of content hashes created by this address
}
```

### Contract Features
- **Immutable Records**: Once registered, content cannot be altered or deleted
- **Timestamp Verification**: Uses Aptos framework's built-in timestamp functionality
- **Creator Registry**: Maintains a comprehensive list of all content per creator
- **Global Accessibility**: Anyone can verify content authenticity
- **Low Gas Fees**: Efficient design minimizes transaction costs

### Deployment Information
- **Network**: Aptos Mainnet/Testnet
- **Module Address**: `[To be updated after deployment]`
- **Contract Size**: 48 lines of Move code

## Screenshots


### 1. Smart Contract Structure
public entry fun record_document(sender: &signer, ipfs_hash: String, file_hash: String) {
        let owner_addr = aptos_framework::account::signer_address(sender);
        let timestamp = aptos_framework::timestamp::now_seconds();

        let document = Document {
            ipfs_hash,
            file_hash,
            timestamp,
            owner: owner_addr,
        };

        let document_object = object::create_object(document);

        event::emit(DocumentRecordedEvent {
            document_id: document_object,
            owner: owner_addr,
            ipfs_hash,
            timestamp,
        });
    }
}


### 2. Content Registration Process
Select the digital content you want to register (image, video, document, audio, etc.)
Generate a unique hash of your content

Use SHA-256 or similar hashing algorithm
This creates a unique fingerprint of your content
Example: a1b2c3d4e5f6... (64-character hash)



Step 2: Connect Your Wallet

Open the ChainProof application
Click "Connect Wallet" button
Select your Aptos wallet (Petra, Martian, etc.)
Authorize the connection in your wallet
Verify your wallet address is displayed correctly

Step 3: Navigate to Registration Page

Go to the "Register Content" section
Click "New Registration" or similar button
Ensure you're on the content registration form

Step 4: Fill Registration Form

Content Hash Field

Paste your generated content hash
Verify the hash is correct (64 characters for SHA-256)


Content Title

Enter a descriptive title for your content
Example: "Sunset Photography - Goa Beach 2024"


Content Type

Select from dropdown or enter manually
Options: "image", "video", "article", "audio", "document", etc.
Example: "image"



Step 5: Review Registration Details

Verify all information is correct:

Content hash matches your file
Title accurately describes your content
Content type is appropriate
Your wallet address is correct


Check transaction fee estimation

Review gas fees required
Ensure sufficient APT balance



Step 6: Submit Registration

Click "Register Content" button
Wallet popup will appear requesting transaction approval
Review transaction details in wallet:

Function: register_content
Parameters: hash, title, content_type
Gas fee amount


Approve the transaction in your wallet

Step 7: Transaction Processing

Wait for blockchain confirmation

Transaction will be processed on Aptos network
Usually takes 5-10 seconds


Monitor transaction status

"Pending" → "Processing" → "Confirmed"
Transaction hash will be generated



Step 8: Registration Confirmation

Success notification will appear
Registration timestamp will be recorded automatically
Transaction hash will be provided for reference
Content is now registered on blockchain

Step 9: Verify Registration (Optional)

Go to "Verify Content" section
Enter your content hash
Enter your wallet address
Click "Verify" to confirm registration
System should return:

✅ Authentic: True

### 3. Content Verification Interface
Step-by-Step Verification Process
Step 1: Access Verification Interface

Navigate to "Verify Content" section in the application
No wallet connection required - this is a public verification tool
Locate the verification form with input fields

Step 2: Enter Content Information

Content Hash Field

Enter the unique hash of the content you want to verify
Must be the exact same hash used during registration
Format: 64-character string (for SHA-256)
Example: a1b2c3d4e5f6789abcdef123456789abcdef123456789abcdef123456789abcd


Creator Address Field

Enter the wallet address of the claimed creator
Format: Aptos address (66 characters starting with 0x)
Example: 0x1234567890abcdef1234567890abcdef12345678



Step 3: Initiate Verification

Click "Verify Content" button
System queries the blockchain using the smart contract's verify_content_origin function
No transaction fees - this is a read-only operation
Results appear instantly (usually within 2-3 seconds)

Step 4: Interpret Verification Results
✅ Verified Authentic
Status: AUTHENTIC ✅
Creator: 0x1234567890abcdef...
Registration Date: March 15, 2024, 10:30 AM UTC
Content Hash: a1b2c3d4e5f6789...
Verification: SUCCESS
❌ Not Verified
Status: NOT AUTHENTIC ❌
Reason: Content not found or creator mismatch
Verification: FAILED
Interface Features
Real-Time Verification

Instant Results: Blockchain query returns results immediately
No Delays: Read operations don't require mining/confirmation
Always Available: 24/7 verification without downtime

Detailed Information Display
When content is verified, the interface shows:

✅ Authenticity Status (True/False)
📅 Registration Timestamp (Human-readable format)
👤 Original Creator Address
🔗 Content Hash (Confirmation of queried content)
📝 Content Details (Title and type if available)

### 4. Creator Dashboard
# Creator Dashboard - Complete Guide

## Overview
The Creator Dashboard is your personal control center for managing all your registered digital content. It provides a comprehensive view of your content portfolio, registration history, and verification statistics.

## Dashboard Access & Setup

### Getting Started
1. **Connect Your Wallet** to access your personal dashboard
2. **Verify Wallet Address** matches your content registrations
3. **Dashboard automatically loads** all content associated with your address
4. **First-time users** will see empty dashboard with registration prompts

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Creator Profile | Wallet Address | Total Content   │
├─────────────────────────────────────────────────────────────┤
│ Quick Stats: Registered | Verified | Recent Activity       │
├─────────────────────────────────────────────────────────────┤
│ Content Library: Grid/List View of All Registered Content  │
├─────────────────────────────────────────────────────────────┤
│ Recent Activity: Latest Registrations & Verifications      │
└─────────────────────────────────────────────────────────────┘
```

## Dashboard Features

### 📊 **Quick Statistics Panel**
- **Total Registered Content**: Number of items you've registered
- **Total Verifications**: How many times your content was verified by others
- **Registration Success Rate**: Percentage of successful registrations
- **Most Verified Content**: Your most popular/verified items
- **Recent Activity**: Last 5 registrations or verifications

### 📁 **Content Library Management**

#### Content Grid View
Each content item displays:
```
┌─────────────────────────────────────┐
│ [Content Type Icon] Title           │
│ Hash: a1b2c3d4...                   │
│ Registered: Mar 15, 2024            │
│ Verifications: 23 times             │
│ [View] [Share] [Download Proof]     │
└─────────────────────────────────────┘
```

#### Content List View
| Title | Type | Registration Date | Hash (Short) | Verifications | Actions |
|-------|------|------------------|--------------|---------------|---------|
| Beach Sunset Photo | image | Mar 15, 2024 | a1b2c3d4... | 23 | [View][Share] |
| Travel Blog Article | article | Mar 10, 2024 | f7e8d9c1... | 8 | [View][Share] |

### 🔍 **Search & Filter Options**
- **Search by Title**: Find specific content quickly
- **Filter by Content Type**: Images, videos, articles, documents, etc.
- **Sort by Date**: Newest/oldest first
- **Sort by Verifications**: Most/least verified
- **Date Range Filter**: Content registered within specific periods

### 📈 **Analytics & Insights**

#### Registration Trends
- **Monthly Registration Chart**: Visual representation of your registration activity
- **Content Type Distribution**: Pie chart showing types of content you register
- **Peak Activity Times**: When you're most active in registering content

#### Verification Analytics
- **Verification Frequency**: How often your content gets verified
- **Popular Content**: Which items get verified most
- **Verification Sources**: Geographic or platform data of verifiers
- **Trust Score**: Overall authenticity score based on verifications

## Individual Content Management

### Content Detail View
When clicking on any registered content:

#### 📋 **Content Information**
- **Full Title**: Complete content title
- **Content Type**: Category/type of digital content
- **Registration Date**: Exact timestamp of blockchain registration
- **Content Hash**: Full cryptographic hash
- **Creator Address**: Your wallet address (confirmation)
- **Transaction Hash**: Blockchain transaction reference

#### ✅ **Verification Status**
- **Total Verifications**: Number of times verified by others
- **Recent Verifications**: Latest verification attempts with timestamps
- **Verification History**: Complete log of all verification requests
- **Failed Verifications**: Any failed verification attempts and reasons

#### 🛠 **Content Actions**
- **Share Verification Link**: Generate public verification URL
- **Download Proof Certificate**: PDF/digital certificate of ownership
- **Copy Content Hash**: Quick copy for sharing or verification
- **Generate QR Code**: QR code containing verification information
- **Report Misuse**: Flag unauthorized use of your content

### Bulk Content Operations
- **Select Multiple Items**: Checkbox selection for bulk operations
- **Bulk Download**: Download multiple proof certificates
- **Bulk Share**: Generate shareable links for multiple items
- **Export Content List**: CSV/Excel export of your content registry
- **Bulk Delete** *(Note: Blockchain records cannot be deleted, only hidden from dashboard)*

## Dashboard Notifications & Alerts

### 🔔 **Real-Time Notifications**
- **New Verifications**: When someone verifies your content
- **Registration Confirmations**: Blockchain confirmation of new registrations
- **Suspicious Activity**: Potential unauthorized use detected
- **Platform Updates**: Changes to the verification system

### 📧 **Email Notifications** (Optional)
- **Daily Summary**: Summary of verification activity
- **Weekly Report**: Detailed analytics report
- **Suspicious Activity Alerts**: Immediate alerts for potential misuse
- **Registration Reminders**: Prompts to register new content

## Mobile Dashboard Features

### 📱 **Mobile-Responsive Design**
- **Touch-Friendly Interface**: Optimized for mobile interaction
- **Swipe Actions**: Swipe to share, verify, or view details
- **Mobile Upload**: Register content directly from mobile device
- **Camera Integration**: Hash generation from mobile camera

### 📴 **Offline Capabilities**
- **Cached Dashboard**: View registered content offline
- **Offline Verification**: Limited verification using cached data
- **Sync When Online**: Automatic sync when connection restored

## Security & Privacy Features

### 🔐 **Account Security**
- **Wallet Integration**: Secure authentication through blockchain wallet
- **Two-Factor Authentication**: Optional 2FA for enhanced security
- **Session Management**: Automatic logout after inactivity
- **Activity Logging**: Complete log of dashboard activities

### 🛡️ **Privacy Controls**
- **Public Profile Settings**: Control what information is publicly visible
- **Content Visibility**: Hide specific content from public searches
- **Verification Privacy**: Control who can verify your content
- **Data Export**: Download all your data at any time





### 📊 **Professional Analytics**
- **ROI Tracking**: Value generated from content registrations
- **Brand Protection Score**: Overall protection level of your digital assets
- **Competitive Analysis**: Compare with other creators (anonymized)
- **Legal Report Generation**: Formal reports for legal proceedings

## Dashboard Customization

### 🎨 **Interface Customization**
- **Dark/Light Mode**: Theme preferences
- **Layout Options**: Grid, list, or card view preferences
- **Column Customization**: Choose which information to display
- **Dashboard Widgets**: Add/remove dashboard components

### ⚙️ **Notification Settings**
- **Notification Frequency**: Control how often you receive updates
- **Notification Types**: Choose which events trigger notifications
- **Quiet Hours**: Set times when notifications are paused
- **Channel Preferences**: Email, in-app, or push notifications

## Team Members
1.Ponna Anand raju- ponnaanandraj318@gmail.com
2.Puppala Lahari - laharipuppala6@gmail.com
3.Sukhavasi Saranya - sukhavasisaranya11@gmail.com