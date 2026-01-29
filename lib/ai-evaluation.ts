/**
 * EchoGuard AI Evaluation Logic (Mocked)
 * Deterministic, explainable evaluation based on call characteristics
 */

export interface CallCharacteristics {
  durationSeconds: number;
  callType: 'inbound' | 'outbound';
  transcript?: string;
  sentimentScore?: number; // -1 to 1
  escalationRisk?: 'low' | 'medium' | 'high';
}

export interface EvaluationScore {
  qaScore: number; // 0-100
  scriptAdherenceScore: number; // 0-100
  resolutionCorrectnessScore: number; // 0-100
  sopViolations: Record<string, string[]>;
  explanations: Record<string, string>;
}

/**
 * Evaluate call quality based on various factors
 * This is a MOCKED but DETERMINISTIC algorithm
 */
export function evaluateCall(
  characteristics: CallCharacteristics
): EvaluationScore {
  let qaScore = 70; // baseline
  let scriptAdherenceScore = 75;
  let resolutionCorrectnessScore = 70;
  const sopViolations: Record<string, string[]> = {};
  const explanations: Record<string, string> = {};

  // 1. Duration analysis
  // Typical call: 200-500 seconds
  if (characteristics.durationSeconds < 120) {
    qaScore -= 10;
    scriptAdherenceScore -= 5;
    sopViolations['duration'] = ['Call too short - likely rushed or incomplete'];
    explanations['duration'] = 'Call duration is below optimal range';
  } else if (characteristics.durationSeconds > 1200) {
    qaScore -= 8;
    sopViolations['duration'] = ['Call too long - inefficient handling'];
    explanations['duration'] = 'Call duration exceeds optimal range';
  } else if (characteristics.durationSeconds > 300) {
    // Good duration for complex issues
    qaScore += 5;
    explanations['duration'] = 'Call duration appropriate for call type';
  }

  // 2. Sentiment analysis
  if (characteristics.sentimentScore !== undefined) {
    if (characteristics.sentimentScore < -0.5) {
      // Very negative sentiment
      qaScore -= 15;
      resolutionCorrectnessScore -= 10;
      sopViolations['sentiment'] = ['Customer remained very negative throughout call'];
      explanations['sentiment'] = 'Customer sentiment deteriorated during call';
    } else if (characteristics.sentimentScore < 0) {
      // Negative sentiment
      qaScore -= 8;
      resolutionCorrectnessScore -= 5;
      explanations['sentiment'] = 'Customer was initially negative';
    } else if (characteristics.sentimentScore > 0.7) {
      // Very positive sentiment
      qaScore += 10;
      resolutionCorrectnessScore += 5;
      explanations['sentiment'] = 'Customer very satisfied with resolution';
    } else if (characteristics.sentimentScore > 0.3) {
      qaScore += 5;
      explanations['sentiment'] = 'Customer sentiment improved during call';
    }
  }

  // 3. Escalation risk analysis
  if (characteristics.escalationRisk === 'high') {
    qaScore -= 12;
    scriptAdherenceScore -= 8;
    sopViolations['escalation_risk'] = [
      'High escalation risk detected - improper handling',
    ];
    explanations['escalation_risk'] = 'Call carried high escalation risk';
  } else if (characteristics.escalationRisk === 'medium') {
    qaScore -= 5;
    explanations['escalation_risk'] = 'Call had moderate escalation risk';
  }

  // 4. Transcript-based scoring (if available)
  if (characteristics.transcript) {
    const transcript = characteristics.transcript.toLowerCase();

    // Check for SOP compliance
    const greetingPatterns = ['thank you', 'how can i help', 'my name is'];
    const hasProperGreeting = greetingPatterns.some((pattern) =>
      transcript.includes(pattern)
    );

    if (hasProperGreeting) {
      scriptAdherenceScore += 10;
      explanations['greeting'] = 'Agent used proper greeting protocol';
    } else {
      scriptAdherenceScore -= 8;
      sopViolations['greeting'] = ['Agent greeting did not follow protocol'];
      explanations['greeting'] = 'Greeting protocol not followed';
    }

    // Check for empathy and soft skills
    const empathyPatterns = [
      'sorry',
      'understand',
      'appreciate',
      'thank you',
    ];
    const empathyMentions = empathyPatterns.filter((pattern) =>
      transcript.includes(pattern)
    ).length;

    if (empathyMentions >= 2) {
      qaScore += 8;
      explanations['empathy'] = 'Good display of empathy and soft skills';
    } else if (empathyMentions === 1) {
      qaScore += 4;
      explanations['empathy'] = 'Some empathy shown';
    } else {
      qaScore -= 5;
      sopViolations['soft_skills'] = ['Insufficient empathy displayed'];
      explanations['empathy'] = 'Minimal empathy shown in call';
    }

    // Check for proper closing
    const closingPatterns = ['anything else', 'help you with', 'have a great'];
    const hasProperClosing = closingPatterns.some((pattern) =>
      transcript.includes(pattern)
    );

    if (hasProperClosing) {
      scriptAdherenceScore += 8;
      explanations['closing'] = 'Agent used proper call closing protocol';
    } else {
      scriptAdherenceScore -= 5;
      sopViolations['closing'] = ['Call closing did not follow protocol'];
      explanations['closing'] = 'Closing protocol not followed';
    }

    // Detect security/compliance issues
    const securityPatterns = ['password', 'ssn', 'social security', 'credit card'];
    const securityViolations = securityPatterns.filter((pattern) =>
      transcript.includes(pattern)
    );

    if (securityViolations.length > 0) {
      qaScore -= 20;
      scriptAdherenceScore -= 15;
      sopViolations['security'] = [
        `Potential security violation: ${securityViolations.join(', ')}`,
      ];
      explanations['security'] = 'Security/Compliance issue detected';
    }

    // Check for problem resolution indicators
    const resolutionPatterns = [
      'solved',
      'fixed',
      'resolved',
      'working now',
      'all set',
    ];
    const resolutionMentions = resolutionPatterns.filter((pattern) =>
      transcript.includes(pattern)
    ).length;

    if (resolutionMentions >= 1) {
      resolutionCorrectnessScore += 10;
      explanations['resolution'] = 'Clear indication of problem resolution';
    } else if (
      transcript.includes('refund') ||
      transcript.includes('escalate')
    ) {
      resolutionCorrectnessScore += 5;
      explanations['resolution'] = 'Alternative resolution provided';
    }
  }

  // Normalize scores to 0-100 range
  qaScore = Math.max(0, Math.min(100, qaScore));
  scriptAdherenceScore = Math.max(0, Math.min(100, scriptAdherenceScore));
  resolutionCorrectnessScore = Math.max(
    0,
    Math.min(100, resolutionCorrectnessScore)
  );

  return {
    qaScore: Math.round(qaScore),
    scriptAdherenceScore: Math.round(scriptAdherenceScore),
    resolutionCorrectnessScore: Math.round(resolutionCorrectnessScore),
    sopViolations,
    explanations,
  };
}

/**
 * Detect if an alert should be triggered
 */
export function shouldTriggerAlert(
  qaScore: number,
  escalationRisk: string,
  sopViolations: Record<string, string[]>
): { shouldAlert: boolean; severity: 'low' | 'medium' | 'high'; reason: string } {
  const violationCount = Object.keys(sopViolations).length;

  if (violationCount > 0 && qaScore < 60) {
    return {
      shouldAlert: true,
      severity: 'high',
      reason: 'Multiple SOP violations with low quality score',
    };
  }

  if (escalationRisk === 'high' && qaScore < 70) {
    return {
      shouldAlert: true,
      severity: 'high',
      reason: 'High escalation risk with suboptimal handling',
    };
  }

  if (sopViolations['security']) {
    return {
      shouldAlert: true,
      severity: 'high',
      reason: 'Security/Compliance violation detected',
    };
  }

  if (qaScore < 60) {
    return {
      shouldAlert: true,
      severity: 'medium',
      reason: 'Quality score below threshold',
    };
  }

  if (violationCount > 0) {
    return {
      shouldAlert: true,
      severity: 'low',
      reason: 'Minor SOP violations detected',
    };
  }

  return {
    shouldAlert: false,
    severity: 'low',
    reason: 'No issues detected',
  };
}

/**
 * Generate coaching insights based on evaluation
 */
export function generateCoachingInsights(
  evaluation: EvaluationScore,
  qaScore: number
): Array<{ text: string; priority: 'low' | 'medium' | 'high' }> {
  const insights: Array<{ text: string; priority: 'low' | 'medium' | 'high' }> =
    [];

  // Script adherence
  if (evaluation.scriptAdherenceScore < 70) {
    insights.push({
      text: `Your script adherence score was ${evaluation.scriptAdherenceScore}/100. Focus on following the greeting and closing protocols more consistently.`,
      priority: 'medium',
    });
  } else if (evaluation.scriptAdherenceScore > 85) {
    insights.push({
      text: `Excellent script adherence! You're consistently following procedures. Keep it up!`,
      priority: 'low',
    });
  }

  // Resolution
  if (evaluation.resolutionCorrectnessScore < 70) {
    insights.push({
      text: `Your resolution score was ${evaluation.resolutionCorrectnessScore}/100. Try to ensure customers feel their issues are fully resolved before ending the call.`,
      priority: 'high',
    });
  }

  // SOP violations
  for (const [violationType, violations] of Object.entries(
    evaluation.sopViolations
  )) {
    violations.forEach((violation) => {
      insights.push({
        text: `[${violationType}] ${violation}. Review the SOP for this area.`,
        priority: violationType === 'security' ? 'high' : 'medium',
      });
    });
  }

  // Positive feedback
  if (qaScore > 85) {
    insights.push({
      text: 'Great performance! Your quality score exceeds expectations. Consider mentoring newer team members.',
      priority: 'low',
    });
  }

  return insights;
}
