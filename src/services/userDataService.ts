// import { getDefaultLabResults } from "./defaultLabResults";

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
  
  private getDefaultData(): UserLabData {
    return {
      labResults: [], //getDefaultLabResults(),
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

  logout(): void {
    localStorage.clear();
  }
}

export default UserDataService;
export type { LabEntry, UserLabData };
