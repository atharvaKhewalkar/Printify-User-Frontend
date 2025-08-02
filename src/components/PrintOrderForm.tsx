import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { Printer } from 'lucide-react';

export interface OrderDetails {
  file: File | null;
  name: string;
  copies: number;
  paperSize: 'A4' | 'A3' | '';
  printSide: 'one-sided' | 'double-sided' | '';
  color: 'color' | 'bw' | '';
}

interface PrintOrderFormProps {
  onSubmit: (order: OrderDetails) => void;
}

export const PrintOrderForm: React.FC<PrintOrderFormProps> = ({ onSubmit }) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    file: null,
    name: '',
    copies: 1,
    paperSize: '',
    printSide: '',
    color: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderDetails.file && orderDetails.name && orderDetails.paperSize && 
        orderDetails.printSide && orderDetails.color) {
      onSubmit(orderDetails);
    }
  };

  const isFormValid = orderDetails.file && orderDetails.name && orderDetails.paperSize && 
                     orderDetails.printSide && orderDetails.color;

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6 animate-scale-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Printer className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Paradise Xerox</h1>
          </div>
          <p className="text-muted-foreground">Submit your print order</p>
        </div>

        {/* Order Form */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload File</Label>
                <FileUpload
                  selectedFile={orderDetails.file}
                  onFileSelect={(file) => setOrderDetails(prev => ({ ...prev, file }))}
                />
              </div>

              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={orderDetails.name}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Number of Copies */}
              <div className="space-y-2">
                <Label htmlFor="copies">Number of Copies</Label>
                <Input
                  id="copies"
                  type="number"
                  min="1"
                  value={orderDetails.copies}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, copies: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>

              {/* Paper Size */}
              <div className="space-y-2">
                <Label>Paper Size</Label>
                <Select 
                  value={orderDetails.paperSize} 
                  onValueChange={(value: 'A4' | 'A3') => setOrderDetails(prev => ({ ...prev, paperSize: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select paper size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="A3">A3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Print Side */}
              <div className="space-y-2">
                <Label>Print Side</Label>
                <Select 
                  value={orderDetails.printSide} 
                  onValueChange={(value: 'one-sided' | 'double-sided') => setOrderDetails(prev => ({ ...prev, printSide: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select print side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-sided">One Sided</SelectItem>
                    <SelectItem value="double-sided">Double Sided</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label>Color</Label>
                <Select 
                  value={orderDetails.color} 
                  onValueChange={(value: 'color' | 'bw') => setOrderDetails(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Color</SelectItem>
                    <SelectItem value="bw">Black & White</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!isFormValid}
              >
                Submit Order
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};