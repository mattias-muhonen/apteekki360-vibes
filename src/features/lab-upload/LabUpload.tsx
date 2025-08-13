import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui';
import { Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import OpenAI from 'openai';
import { useAuth } from '../../contexts/AuthContext';
import UserDataService from '../../services/userDataService';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, you'd want to call this from your backend
});

interface LabResult {
    test: string;
    result: string;
    referenceRange: string;
    status: 'Normal' | 'Low' | 'High' | 'Critical';
    unit?: string;
}

interface ProcessedResults {
    date: string;
    results: LabResult[];
    confidence: number;
}

interface LabUploadProps {
    onResultsAdded?: (results: ProcessedResults) => void;
}

const LabUpload = ({ onResultsAdded }: LabUploadProps) => {
    const { user } = useAuth();
    const userDataService = UserDataService.getInstance();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedResults, setProcessedResults] = useState<ProcessedResults | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
            setProcessedResults(null);

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setError(null);
            setProcessedResults(null);

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const processImage = async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        setError(null);

        try {
            // Convert file to base64
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
                };
                reader.readAsDataURL(selectedFile);
            });

            // DO NOT EDIT THE FOLLOWING FUNCTION CALL
            const response = await openai.responses.create({
                model: "gpt-4.1-mini",
                input: [
                    {
                        role: "user",
                        content: [
                            { type: "input_text", text: "The image contains lab results, return the results in json format. The format should be as follows: [{label: what the result is about}, result: numerical value,referenceRange: what the normal range is, status: Normal | Low | High |Critical], unit: unit of the measurement" },
                            {
                                type: "input_image",
                                image_url: `data:image/jpeg;base64,${base64}`,
                            },
                        ],
                    },
                ],
            });

            console.log(response.output_text);
            const result = response.output_text.replace('```json', '').replace('```', '').trim();

            // Parse the response which comes as an array of lab results
            if (!result) {
                throw new Error('No response from OpenAI API');
            }

            try {
                // Parse the JSON array response
                const labResults = JSON.parse(result);
                console.log('PARSED RESULTS:', labResults);
                
                // Transform the API response to match our interface
                const transformedResults: ProcessedResults = {
                    date: new Date().toISOString().split('T')[0], // Use today's date as default
                    results: labResults.map((result: any) => {
                        // Combine numeric result with unit
                        const resultWithUnit = `${result.result} ${result.unit}`;

                        return {
                            test: result.label,
                            result: resultWithUnit,
                            referenceRange: `${result.referenceRange} ${result.unit}`,
                            status: result.status as 'Normal' | 'Low' | 'High' | 'Critical',
                            unit: result.unit
                        };
                    }),
                    confidence: 0.95 // Default confidence since it's not provided
                };
                console.log('PROCESSES', transformedResults)
                setProcessedResults(transformedResults);
            } catch (parseError) {
                console.error('Parse error:', parseError);
                throw new Error('Failed to parse AI response. Please try again.');
            }


        } catch (err) {
            console.error('Error processing image:', err);
            setError(err instanceof Error ? err.message : 'Failed to process image');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveResults = () => {
        if (!processedResults || !user?.id) return;
        
        // Transform processed results to lab entries format
        const labEntries = processedResults.results.map(result => ({
            date: processedResults.date,
            test: result.test,
            result: result.result,
            referenceRange: result.referenceRange,
            status: result.status
        }));
        
        // Add to user data service
        userDataService.addLabResults(user.id, labEntries);
        
        // Call the callback to update the dashboard
        onResultsAdded?.(processedResults);
        
        console.log('Saving results:', processedResults);

        // Close the dialog and reset state
        setIsOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setProcessedResults(null);
    };

    const resetUpload = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setProcessedResults(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Lab Image
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Upload Lab Results Image</DialogTitle>
                    <DialogDescription>
                        Upload an image of your lab results and our AI will extract the data automatically.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* File Upload Area */}
                    {!selectedFile && (
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <div className="mb-4">
                                <p className="text-lg font-medium text-gray-900 mb-1">
                                    Drop your lab results image here
                                </p>
                                <p className="text-sm text-gray-600">
                                    or click to select a file (JPG, PNG, PDF)
                                </p>
                            </div>
                            <Button onClick={() => fileInputRef.current?.click()}>
                                Choose File
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Image Preview */}
                    {previewUrl && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src={previewUrl}
                                    alt="Lab results preview"
                                    className="max-w-full h-auto rounded-lg border"
                                />
                                <div className="mt-4 flex gap-2">
                                    <Button onClick={processImage} disabled={isProcessing}>
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Analyze Results'
                                        )}
                                    </Button>
                                    <Button variant="outline" onClick={resetUpload}>
                                        Choose Different Image
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error Display */}
                    {error && (
                        <Card className="border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center text-red-600">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    <span>{error}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Processed Results */}
                    {processedResults && (
                        <Card className="border-green-200">
                            <CardHeader>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                    <CardTitle className="text-lg">Extracted Results</CardTitle>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Confidence: {Math.round(processedResults.confidence * 100)}%
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium">Date: {processedResults.date}</p>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2 text-sm font-medium">Test</th>
                                                    <th className="text-left py-2 text-sm font-medium">Result</th>
                                                    <th className="text-left py-2 text-sm font-medium">Reference Range</th>
                                                    <th className="text-left py-2 text-sm font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {processedResults.results.map((result, index) => (
                                                    <tr key={index} className="border-b">
                                                        <td className="py-2 text-sm">{result.test}</td>
                                                        <td className="py-2 text-sm font-medium">
                                                            {result.result} {result.unit}
                                                        </td>
                                                        <td className="py-2 text-sm text-gray-600">{result.referenceRange}</td>
                                                        <td className="py-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.status === 'Normal' ? 'bg-green-100 text-green-800' :
                                                                result.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                                                                    result.status === 'High' ? 'bg-orange-100 text-orange-800' :
                                                                        'bg-red-100 text-red-800'
                                                                }`}>
                                                                {result.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    {processedResults && (
                        <Button onClick={handleSaveResults}>
                            Save Results
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LabUpload;
