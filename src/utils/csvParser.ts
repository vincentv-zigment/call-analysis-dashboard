import Papa from 'papaparse';

export interface CallRecord {
  call_id: string;
  unique_id: string;
  agent_name: string;
  call_date: string; // Format: DD-MM-YYYY HH:mm:ss
  talk_time: string; // Format: HH:mm:ss
  talk_time_seconds: number;
  audio_url: string;
  hangup_by: string;
  campaign: string;
  converted: string;
  amount: number;
  script_adherence_score: number;
  script_adherence_score_explanation: string;
  call_opening_score: number;
  call_opening_score_explanation: string;
  empathy_score: number;
  empathy_score_explanation: string;
  sales_motion_objection_handling_score: number;
  sales_motion_objection_handling_score_explanation: string;
  rapport_building_score: number;
  rapport_building_score_explanation: string;
  call_closing_score: number;
  call_closing_score_explanation: string;
  positive_tone_score: number;
  positive_tone_score_explanation: string;
  speech_language_grammar_score: number;
  speech_language_grammar_score_explanation: string;
  total_score: number;
  max_possible_score: number;
  overall_percentage: number;
  strengths: string;
  improvements: string;
  recommendations: string;
  observations: string;
  "Aadil Remark": string;
}

export function parseCSV(csvText: string): Promise<CallRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value: string, field: string): string | number => {
        // Convert numeric fields
        const numericFields = [
          'talk_time_seconds',
          'amount',
          'script_adherence_score',
          'call_opening_score',
          'empathy_score',
          'sales_motion_objection_handling_score',
          'rapport_building_score',
          'call_closing_score',
          'positive_tone_score',
          'speech_language_grammar_score',
          'total_score',
          'max_possible_score',
          'overall_percentage'
        ];

        if (numericFields.includes(field)) {
          const num = parseFloat(value);
          return isNaN(num) ? 0 : num;
        }

        return value.trim();
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        
        const records = results.data as CallRecord[];
        resolve(records);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      }
    });
  });
}
