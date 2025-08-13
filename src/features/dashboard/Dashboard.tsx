import { Link } from 'react-router-dom';
import { useState } from 'react';
import Page from '../../components/Page';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import LabUpload from '../lab-upload/LabUpload';

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

interface LabEntry {
  date: string;
  test: string;
  result: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
}

const Dashboard = () => {
  // Initial lab results data
  const [labResults, setLabResults] = useState<LabEntry[]>([
    {
      date: "Dec 15, 2024",
      test: "Total Testosterone",
      result: "485 ng/dL",
      referenceRange: "300-1000 ng/dL",
      status: "Normal"
    },
    {
      date: "Dec 15, 2024",
      test: "Free Testosterone", 
      result: "12.4 pg/mL",
      referenceRange: "8.7-25.1 pg/mL",
      status: "Normal"
    },
    {
      date: "Dec 15, 2024",
      test: "Vitamin D",
      result: "28 ng/mL", 
      referenceRange: "30-100 ng/mL",
      status: "Low"
    },
    {
      date: "Nov 20, 2024",
      test: "Total Testosterone",
      result: "445 ng/dL",
      referenceRange: "300-1000 ng/dL", 
      status: "Normal"
    }
  ]);

  const handleLabResultsAdded = (processedResults: ProcessedResults) => {
    // Convert the processed results to our lab entry format
    const newEntries: LabEntry[] = processedResults.results.map(result => ({
      date: processedResults.date,
      test: result.test,
      result: result.result,
      referenceRange: result.referenceRange,
      status: result.status
    }));

    // Add new results to the top of the list
    setLabResults(prev => [...newEntries, ...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-800';
      case 'Low':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
  <Page 
    title="Health Dashboard" 
    subtitle="Track your progress and monitor key health metrics over time."
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* KPI Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium">Total Testosterone</CardTitle>
                <span className="text-green-600 text-sm font-medium flex items-center">
                  ↗️ +12%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">485 ng/dL</div>
              <div className="text-sm text-green-600 mb-3">Normal Range</div>
              <div className="flex items-end space-x-1 h-8">
                <div className="bg-purple-300 w-2 flex-1" style={{height: '60%'}}></div>
                <div className="bg-purple-400 w-2 flex-1" style={{height: '70%'}}></div>
                <div className="bg-purple-500 w-2 flex-1" style={{height: '80%'}}></div>
                <div className="bg-purple-600 w-2 flex-1" style={{height: '85%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium">Free Testosterone</CardTitle>
                <span className="text-green-600 text-sm font-medium flex items-center">
                  ↗️ +8%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">12.4 pg/mL</div>
              <div className="text-sm text-green-600 mb-3">Normal Range</div>
              <div className="flex items-end space-x-1 h-8">
                <div className="bg-purple-300 w-2 flex-1" style={{height: '55%'}}></div>
                <div className="bg-purple-400 w-2 flex-1" style={{height: '65%'}}></div>
                <div className="bg-purple-500 w-2 flex-1" style={{height: '75%'}}></div>
                <div className="bg-purple-600 w-2 flex-1" style={{height: '78%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium">Energy Score</CardTitle>
                <span className="text-green-600 text-sm font-medium flex items-center">
                  ↗️ +15%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">7.2/10</div>
              <div className="text-sm text-green-600 mb-3">Good</div>
              <div className="flex items-end space-x-1 h-8">
                <div className="bg-green-300 w-2 flex-1" style={{height: '50%'}}></div>
                <div className="bg-green-400 w-2 flex-1" style={{height: '60%'}}></div>
                <div className="bg-green-500 w-2 flex-1" style={{height: '70%'}}></div>
                <div className="bg-green-600 w-2 flex-1" style={{height: '72%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium">Sleep Score</CardTitle>
                <span className="text-red-600 text-sm font-medium flex items-center">
                  ↘️ -3%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">6.8/10</div>
              <div className="text-sm text-yellow-600 mb-3">Needs Attention</div>
              <div className="flex items-end space-x-1 h-8">
                <div className="bg-yellow-300 w-2 flex-1" style={{height: '75%'}}></div>
                <div className="bg-yellow-400 w-2 flex-1" style={{height: '70%'}}></div>
                <div className="bg-yellow-500 w-2 flex-1" style={{height: '68%'}}></div>
                <div className="bg-yellow-600 w-2 flex-1" style={{height: '68%'}}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Health Plan Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Personal Health Plan</h2>
          <p className="text-lg text-gray-600">Follow these steps to optimize your health</p>
        </div>

        <div className="space-y-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Health Assessment</h4>
                    <p className="text-gray-600">Initial evaluation completed with personalized recommendations</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Completed
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">⏳</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Testosterone Panel Testing</h4>
                    <p className="text-gray-600">Book and complete comprehensive hormone testing</p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/booking">Book Test</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

                    <Card className="border-l-4 border-l-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold">○</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Start Supplement Protocol</h4>
                    <p className="text-gray-600">Begin recommended vitamin D and magnesium supplementation</p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/catalog">Shop Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold">○</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sleep Optimization</h4>
                    <p className="text-gray-600">Implement sleep hygiene improvements and track progress</p>
                  </div>
                </div>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  Upcoming
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lab Results Section */}
      <section>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Lab Results History</CardTitle>
              </div>
              <div className="flex gap-2">
                <LabUpload onResultsAdded={handleLabResultsAdded} />
                <Button variant="outline" size="sm">
                  + Add Manual Result
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Test</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Result</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Reference Range</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {labResults.map((result, index) => (
                    <tr key={index}>
                      <td className="py-3 text-sm text-gray-900">{result.date}</td>
                      <td className="py-3 text-sm text-gray-900">{result.test}</td>
                      <td className="py-3 text-sm font-medium text-gray-900">{result.result}</td>
                      <td className="py-3 text-sm text-gray-600">{result.referenceRange}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  </Page>
  );
};

export default Dashboard;
