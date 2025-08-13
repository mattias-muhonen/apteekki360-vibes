interface LabEntry {
  date: string;
  test: string;
  result: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  id?: string; // Add unique identifier for deletion
}

interface UserLabData {
  labResults: LabEntry[];
  lastUpdated: string;
}

class UserDataService {
  private static instance: UserDataService;
  
  static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

  private getStorageKey(userId: string): string {
    return `health360_labs_${userId}`;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getDefaultLabResults(): LabEntry[] {
    return [
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Hemoglobin",
        result: "15.1 g/dL",
        referenceRange: "13.5 – 17.5 g/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Hematocrit",
        result: "44 %",
        referenceRange: "41 – 53 %",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "WBC (White Blood Cells)",
        result: "6.4 ×10⁹/L",
        referenceRange: "4.0 – 11.0 ×10⁹/L",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Platelets",
        result: "240 ×10⁹/L",
        referenceRange: "150 – 450 ×10⁹/L",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Sodium",
        result: "140 mmol/L",
        referenceRange: "135 – 145 mmol/L",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Potassium",
        result: "4.4 mmol/L",
        referenceRange: "3.5 – 5.0 mmol/L",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Creatinine",
        result: "0.96 mg/dL",
        referenceRange: "0.74 – 1.35 mg/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "eGFR",
        result: "95 mL/min/1.73m²",
        referenceRange: "> 90 mL/min/1.73m²",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Glucose (fasting)",
        result: "92 mg/dL",
        referenceRange: "70 – 99 mg/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Total Cholesterol",
        result: "182 mg/dL",
        referenceRange: "< 200 mg/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "LDL Cholesterol",
        result: "110 mg/dL",
        referenceRange: "< 130 mg/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "HDL Cholesterol",
        result: "52 mg/dL",
        referenceRange: "> 40 mg/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Triglycerides",
        result: "115 mg/dL",
        referenceRange: "< 150 mg/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "ALT",
        result: "22 U/L",
        referenceRange: "7 – 56 U/L",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "AST",
        result: "28 U/L",
        referenceRange: "10 – 40 U/L",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "TSH",
        result: "2.8 mIU/L",
        referenceRange: "0.27 – 4.20 mIU/L",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Free T4",
        result: "1.2 ng/dL",
        referenceRange: "0.93 – 1.70 ng/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Vitamin D",
        result: "28 ng/mL",
        referenceRange: "30 – 100 ng/mL",
        status: "Low"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Vitamin B12",
        result: "450 pg/mL",
        referenceRange: "300 – 900 pg/mL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Iron",
        result: "95 µg/dL",
        referenceRange: "65 – 175 µg/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Ferritin",
        result: "45 ng/mL",
        referenceRange: "15 – 150 ng/mL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "CRP",
        result: "1.8 mg/L",
        referenceRange: "< 3.0 mg/L",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Total Testosterone",
        result: "480 ng/dL",
        referenceRange: "300 – 1000 ng/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "Free Testosterone",
        result: "12.5 pg/mL",
        referenceRange: "8.7 – 25.1 pg/mL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "SHBG",
        result: "35 nmol/L",
        referenceRange: "18 – 54 nmol/L",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Dec 15, 2024",
        test: "PSA",
        result: "1.2 ng/mL",
        referenceRange: "< 4.0 ng/mL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Nov 20, 2024",
        test: "Total Testosterone",
        result: "455 ng/dL",
        referenceRange: "300 – 1000 ng/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Nov 20, 2024",
        test: "Free Testosterone",
        result: "11.8 pg/mL",
        referenceRange: "8.7 – 25.1 pg/mL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Oct 18, 2024",
        test: "Total Testosterone",
        result: "420 ng/dL",
        referenceRange: "300 – 1000 ng/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Oct 18, 2024",
        test: "Free Testosterone",
        result: "10.9 pg/mL",
        referenceRange: "8.7 – 25.1 pg/mL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Sep 15, 2024",
        test: "Total Testosterone",
        result: "385 ng/dL",
        referenceRange: "300 – 1000 ng/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Sep 15, 2024",
        test: "Free Testosterone",
        result: "9.8 pg/mL",
        referenceRange: "8.7 – 25.1 pg/mL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Aug 12, 2024",
        test: "Total Testosterone",
        result: "350 ng/dL",
        referenceRange: "300 – 1000 ng/dL",
        status: "Normal"
      },
      {
        id: this.generateId(),
        date: "Aug 12, 2024",
        test: "Free Testosterone",
        result: "8.9 pg/mL",
        referenceRange: "8.7 – 25.1 pg/mL",
        status: "Normal"
      }
    ];
  }

  private getDefaultData(): UserLabData {
    return {
      labResults: this.getDefaultLabResults(),
      lastUpdated: new Date().toISOString()
    };
  }

  getUserData(userId: string): UserLabData {
    try {
      const stored = localStorage.getItem(this.getStorageKey(userId));
      if (stored) {
        const data = JSON.parse(stored);
        return data;
      }
    } catch (error) {
      console.error('Error loading user lab data:', error);
    }
    
    // Return default data for new users
    return this.getDefaultData();
  }

  saveUserData(userId: string, data: UserLabData): void {
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving user lab data:', error);
    }
  }

  addLabResults(userId: string, newResults: Omit<LabEntry, 'id'>[]): void {
    const data = this.getUserData(userId);
    const resultsWithIds = newResults.map(result => ({
      ...result,
      id: this.generateId()
    }));
    data.labResults = [...data.labResults, ...resultsWithIds];
    this.saveUserData(userId, data);
  }

  deleteLabResult(userId: string, resultId: string): void {
    const data = this.getUserData(userId);
    data.labResults = data.labResults.filter((result: LabEntry) => result.id !== resultId);
    this.saveUserData(userId, data);
  }

  updateLabResults(userId: string, labResults: LabEntry[]): void {
    const data = this.getUserData(userId);
    data.labResults = labResults;
    this.saveUserData(userId, data);
  }

  clearUserData(userId: string): void {
    localStorage.removeItem(this.getStorageKey(userId));
  }
}

export default UserDataService;
export type { LabEntry, UserLabData };
