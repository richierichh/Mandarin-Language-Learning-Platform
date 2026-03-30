/**
 * Minimal SpeechServiceResponse_JsonResult-shaped sample for zh-CN pronunciation assessment.
 * Field names match Microsoft’s pronunciation assessment REST/SDK JSON (NBest[0].Words, optional Phonemes).
 * @see https://learn.microsoft.com/azure/ai-services/speech-service/how-to-pronunciation-assessment
 *
 * Replace with a captured real response during integration testing if Azure returns extra fields.
 */
export const AZURE_JSON_RESULT_SAMPLE = `{
  "NBest": [
    {
      "Confidence": 0.92,
      "Lexical": "你好",
      "ITN": "你好",
      "MaskedITN": "你好",
      "Display": "你好",
      "PronunciationAssessment": {
        "AccuracyScore": 88,
        "FluencyScore": 80,
        "CompletenessScore": 95,
        "ProsodyScore": 76,
        "PronScore": 82
      },
      "Words": [
        {
          "Word": "你",
          "Offset": 0,
          "Duration": 3000000,
          "PronunciationAssessment": {
            "AccuracyScore": 72,
            "ErrorType": "Mispronunciation"
          },
          "Phonemes": [
            {
              "Phoneme": "n",
              "Offset": 0,
              "Duration": 1200000,
              "PronunciationAssessment": { "AccuracyScore": 75, "ErrorType": "None" }
            },
            {
              "Phoneme": "i",
              "Offset": 1200000,
              "Duration": 1800000,
              "PronunciationAssessment": { "AccuracyScore": 68, "ErrorType": "Mispronunciation" }
            }
          ]
        },
        {
          "Word": "好",
          "Offset": 3000000,
          "Duration": 3500000,
          "PronunciationAssessment": {
            "AccuracyScore": 91,
            "ErrorType": "None"
          }
        }
      ]
    }
  ]
}`;
