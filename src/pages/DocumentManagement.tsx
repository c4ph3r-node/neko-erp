import React, { useState } from 'react';
import { Upload, Search, FileText, Image, File, Download, Eye, Trash2, Tag, Calendar, User, Filter } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

const mockDocuments = [
  {
    id: 1,
    name: 'Invoice_INV-001.pdf',
    type: 'invoice',
    size: '245 KB',
    uploadedBy: 'John Smith',
    uploadDate: '2025-01-15',
    tags: ['invoice', 'customer', 'acme-corp'],
    category: 'Financial',
    status: 'processed',
    thumbnail: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  },
  {
    id: 2,
    name: 'Contract_ABC_Corp.docx',
    type: 'contract',
    size: '1.2 MB',
    uploadedBy: 'Jane Doe',
    uploadDate: '2025-01-14',
    tags: ['contract', 'legal', 'abc-corp'],
    category: 'Legal',
    status: 'pending_review',
    thumbnail: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  },
  {
    id: 3,
    name: 'Receipt_Office_Supplies.jpg',
    type: 'receipt',
    size: '890 KB',
    uploadedBy: 'Bob Johnson',
    uploadDate: '2025-01-13',
    tags: ['receipt', 'expense', 'office-supplies'],
    category: 'Expenses',
    status: 'approved',
    thumbnail: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  },
  {
    id: 4,
    name: 'Employee_Handbook_2025.pdf',
    type: 'policy',
    size: '3.4 MB',
    uploadedBy: 'HR Department',
    uploadDate: '2025-01-12',
    tags: ['hr', 'policy', 'handbook'],
    category: 'HR',
    status: 'published',
    thumbnail: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  },
  {
    id: 5,
    name: 'Bank_Statement_Jan_2025.pdf',
    type: 'statement',
    size: '567 KB',
    uploadedBy: 'Finance Team',
    uploadDate: '2025-01-11',
    tags: ['bank', 'statement', 'january'],
    category: 'Banking',
    status: 'reconciled',
    thumbnail: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  },
  {
    id: 6,
    name: 'Product_Catalog_2025.xlsx',
    type: 'spreadsheet',
    size: '2.1 MB',
    uploadedBy: 'Sales Team',
    uploadDate: '2025-01-10',
    tags: ['product', 'catalog', 'sales'],
    category: 'Sales',
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  }
];

const documentCategories = [
  'All Categories',
  'Financial',
  'Legal',
  'HR',
  'Sales',
  'Banking',
  'Expenses',
  'Contracts',
  'Policies'
];

export default function DocumentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Categories' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'invoice':
      case 'receipt':
      case 'statement':
        return FileText;
      case 'contract':
      case 'policy':
        return File;
      case 'image':
        return Image;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
      case 'approved':
      case 'published':
      case 'reconciled':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUploadModal(false);
            setUploadProgress(0);
            setSelectedFiles(null);
          }, 1000);
        }
      }, 200);
    }
  };

  const handleDownload = (docId: number) => {
    console.log('Downloading document:', docId);
  };

  const handleView = (docId: number) => {
    console.log('Viewing document:', docId);
  };

  const handleDelete = (docId: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      console.log('Deleting document:', docId);
    }
  };

  const totalDocuments = filteredDocuments.length;
  const totalSize = filteredDocuments.reduce((sum, doc) => {
    const size = parseFloat(doc.size.split(' ')[0]);
    const unit = doc.size.split(' ')[1];
    return sum + (unit === 'MB' ? size * 1024 : size);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600">Upload, organize, and manage your business documents</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Tag className="w-4 h-4 mr-2" />
            Manage Tags
          </Button>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalDocuments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{(totalSize / 1024).toFixed(1)} MB</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{documentCategories.length - 1}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Uploads</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {filteredDocuments.filter(doc => 
                  new Date(doc.uploadDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {documentCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </Card>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc) => {
            const FileIcon = getFileIcon(doc.type);
            return (
              <Card key={doc.id}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <FileIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 truncate" title={doc.name}>
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-500">{doc.size}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{doc.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {doc.uploadedBy}
                    </div>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {doc.uploadDate}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleView(doc.id)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDownload(doc.id)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => {
                  const FileIcon = getFileIcon(doc.type);
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded-lg mr-3">
                            <FileIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {doc.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="inline-block px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{doc.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{doc.size}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{doc.uploadedBy}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{doc.uploadDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600" onClick={() => handleView(doc.id)}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-green-600" onClick={() => handleDownload(doc.id)}>
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-red-600" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Documents"
        size="lg"
      >
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Upload your documents</p>
            <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload">
              <Button as="span">
                Choose Files
              </Button>
            </label>
          </div>

          {selectedFiles && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Selected Files:</h3>
              {Array.from(selectedFiles).map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="w-32">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button disabled={!selectedFiles || uploadProgress > 0}>
              {uploadProgress > 0 ? 'Uploading...' : 'Upload Documents'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}