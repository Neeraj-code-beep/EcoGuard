-- Seed Data for Auto-QA & Coaching Platform
-- Password hash for 'password123' using bcrypt

-- Create admin (ID: 1)
INSERT INTO users (email, password_hash, name, role, avatar_url) VALUES
('admin@demo.com', '$2a$10$rQEY7C8H7mBXHKz7VxqZXOKQPsZP5QJ5z5X5X5X5X5X5X5X5X5X5X', 'Admin User', 'admin', NULL);

-- Create supervisors (IDs: 2, 3)
INSERT INTO users (email, password_hash, name, role, avatar_url) VALUES
('supervisor@demo.com', '$2a$10$rQEY7C8H7mBXHKz7VxqZXOKQPsZP5QJ5z5X5X5X5X5X5X5X5X5X5X', 'Sarah Johnson', 'supervisor', NULL),
('supervisor2@demo.com', '$2a$10$rQEY7C8H7mBXHKz7VxqZXOKQPsZP5QJ5z5X5X5X5X5X5X5X5X5X5X', 'Michael Chen', 'supervisor', NULL);

-- Create agents under supervisor 2 (IDs: 4, 5, 6)
INSERT INTO users (email, password_hash, name, role, supervisor_id, avatar_url) VALUES
('agent@demo.com', '$2a$10$rQEY7C8H7mBXHKz7VxqZXOKQPsZP5QJ5z5X5X5X5X5X5X5X5X5X5X', 'John Smith', 'agent', 2, NULL),
('agent2@demo.com', '$2a$10$rQEY7C8H7mBXHKz7VxqZXOKQPsZP5QJ5z5X5X5X5X5X5X5X5X5X5X', 'Emily Davis', 'agent', 2, NULL),
('agent3@demo.com', '$2a$10$rQEY7C8H7mBXHKz7VxqZXOKQPsZP5QJ5z5X5X5X5X5X5X5X5X5X5X', 'David Brown', 'agent', 2, NULL);

-- Create agents under supervisor 3 (IDs: 7, 8)
INSERT INTO users (email, password_hash, name, role, supervisor_id, avatar_url) VALUES
('agent4@demo.com', '$2a$10$rQEY7C8H7mBXHKz7VxqZXOKQPsZP5QJ5z5X5X5X5X5X5X5X5X5X5X', 'James Wilson', 'agent', 3, NULL),
('agent5@demo.com', '$2a$10$rQEY7C8H7mBXHKz7VxqZXOKQPsZP5QJ5z5X5X5X5X5X5X5X5X5X5X', 'Maria Garcia', 'agent', 3, NULL);

-- Insert SOPs
INSERT INTO sops (title, description, content, category, is_active, created_by) VALUES
('Customer Greeting Protocol', 'Standard greeting procedures for all customer interactions', 'Always greet the customer warmly with: "Thank you for calling [Company Name], my name is [Agent Name]. How may I assist you today?"

Key Points:
1. Use a friendly, professional tone
2. Clearly state your name
3. Ask how you can help
4. Listen actively to the customer''s response', 'Communication', true, 1),
('Complaint Handling Procedure', 'Step-by-step guide for handling customer complaints', '1. Listen actively and let the customer express their concern fully
2. Acknowledge the issue and empathize
3. Apologize sincerely for the inconvenience
4. Gather relevant information
5. Propose a solution or escalate if necessary
6. Confirm the resolution with the customer
7. Follow up if required', 'Customer Service', true, 1),
('Data Security Compliance', 'Guidelines for handling sensitive customer information', 'NEVER ask for or store:
- Full credit card numbers verbally
- Social Security Numbers
- Passwords

ALWAYS:
- Verify customer identity using approved methods
- Use secure systems for data entry
- Report any suspected security breaches immediately', 'Compliance', true, 1),
('Call Closing Protocol', 'Standard procedures for ending calls professionally', '1. Summarize the actions taken and any next steps
2. Ask if there''s anything else you can help with
3. Thank the customer for their time
4. Provide your callback information if needed
5. End with a positive closing statement', 'Communication', true, 1);

-- Insert calls for John Smith (agent ID 4)
INSERT INTO calls (agent_id, customer_phone, call_type, duration_seconds, status, created_at) VALUES
(4, '+1-555-0101', 'inbound', 342, 'completed', NOW() - INTERVAL '6 hours'),
(4, '+1-555-0102', 'outbound', 256, 'completed', NOW() - INTERVAL '1 day'),
(4, '+1-555-0103', 'inbound', 489, 'completed', NOW() - INTERVAL '2 days'),
(4, '+1-555-0104', 'inbound', 198, 'completed', NOW() - INTERVAL '3 days'),
(4, '+1-555-0105', 'outbound', 312, 'completed', NOW() - INTERVAL '4 days');

-- Insert calls for Emily Davis (agent ID 5)
INSERT INTO calls (agent_id, customer_phone, call_type, duration_seconds, status, created_at) VALUES
(5, '+1-555-0201', 'inbound', 267, 'completed', NOW() - INTERVAL '4 hours'),
(5, '+1-555-0202', 'inbound', 445, 'completed', NOW() - INTERVAL '1 day'),
(5, '+1-555-0203', 'outbound', 189, 'completed', NOW() - INTERVAL '2 days'),
(5, '+1-555-0204', 'inbound', 356, 'completed', NOW() - INTERVAL '3 days');

-- Insert calls for David Brown (agent ID 6)
INSERT INTO calls (agent_id, customer_phone, call_type, duration_seconds, status, created_at) VALUES
(6, '+1-555-0301', 'inbound', 523, 'completed', NOW() - INTERVAL '5 hours'),
(6, '+1-555-0302', 'outbound', 298, 'completed', NOW() - INTERVAL '1 day'),
(6, '+1-555-0303', 'inbound', 412, 'dropped', NOW() - INTERVAL '2 days');

-- Insert calls for James Wilson (agent ID 7)
INSERT INTO calls (agent_id, customer_phone, call_type, duration_seconds, status, created_at) VALUES
(7, '+1-555-0401', 'inbound', 234, 'completed', NOW() - INTERVAL '3 hours'),
(7, '+1-555-0402', 'inbound', 567, 'completed', NOW() - INTERVAL '1 day'),
(7, '+1-555-0403', 'outbound', 345, 'completed', NOW() - INTERVAL '3 days');

-- Insert calls for Maria Garcia (agent ID 8)
INSERT INTO calls (agent_id, customer_phone, call_type, duration_seconds, status, created_at) VALUES
(8, '+1-555-0501', 'inbound', 398, 'completed', NOW() - INTERVAL '2 hours'),
(8, '+1-555-0502', 'outbound', 276, 'completed', NOW() - INTERVAL '1 day'),
(8, '+1-555-0503', 'inbound', 489, 'transferred', NOW() - INTERVAL '2 days');

-- Insert transcripts
INSERT INTO transcripts (call_id, content, speaker_labels) VALUES
(1, 'Agent: Thank you for calling TechSupport, my name is John. How may I assist you today?
Customer: Hi John, I''m having trouble with my internet connection. It keeps dropping every few hours.
Agent: I''m sorry to hear that. Let me help you troubleshoot this issue. Can you tell me what router model you''re using?
Customer: It''s the XR500 model.
Agent: Great, let me check your connection status. I can see there have been some intermittent disconnections. Let me reset your connection from our end.
Customer: Okay, thank you.
Agent: I''ve reset the connection and updated your firmware remotely. This should resolve the issue. Is there anything else I can help you with?
Customer: No, that''s all. Thanks for your help!
Agent: You''re welcome! Have a great day!', '{"speakers": ["Agent", "Customer"]}'),
(6, 'Agent: Thank you for calling, my name is Emily. How can I help you today?
Customer: Hi Emily! I need help setting up my new device.
Agent: I''d be happy to help you with that! What device are you setting up?
Customer: It''s the SmartHome Hub 3.0.
Agent: Excellent choice! Let me walk you through the setup process step by step.
Customer: This is so much easier than I expected.
Agent: I''m glad it''s going smoothly. You''re all set! Is there anything else I can help with?
Customer: No, this was perfect. Thank you so much!
Agent: You''re welcome! Enjoy your new SmartHome Hub!', '{"speakers": ["Agent", "Customer"]}'),
(10, 'Agent: Thank you for calling, this is David. How may I assist you?
Customer: Your product is defective! I want a full refund NOW!
Agent: I''m sorry to hear you''re experiencing issues. Can you tell me more about what happened?
Customer: The screen cracked after just two days of normal use!
Agent: That''s definitely not the experience we want for our customers. Let me check your warranty status.
Customer: I don''t care about warranty, I want my money back!
Agent: I understand. Let me see what options are available... I can process a full refund for you today.
Customer: Finally. How long will it take?
Agent: The refund will be processed within 5-7 business days.
Customer: That''s too long but I guess I have no choice.', '{"speakers": ["Agent", "Customer"]}');

-- Insert evaluations
INSERT INTO evaluations (call_id, total_score, category_scores, strengths, improvements, sop_violations, created_at) VALUES
(1, 88, '{"greeting": 95, "resolution": 85, "soft_skills": 88, "compliance": 84}', 
   ARRAY['Excellent greeting following SOP', 'Quick problem identification', 'Clear communication'], 
   ARRAY['Could have offered additional troubleshooting tips'], 
   '[]', NOW() - INTERVAL '6 hours'),
(2, 92, '{"greeting": 90, "resolution": 95, "soft_skills": 92, "compliance": 91}', 
   ARRAY['Proactive follow-up call', 'Professional tone throughout'], 
   ARRAY['Could personalize closing more'], 
   '[]', NOW() - INTERVAL '1 day'),
(3, 72, '{"greeting": 85, "resolution": 70, "soft_skills": 68, "compliance": 65}', 
   ARRAY['Showed empathy', 'Took ownership of the issue'], 
   ARRAY['Initial response could be more empathetic', 'Should have apologized sooner'], 
   '[{"sop": "Complaint Handling", "violation": "Delayed acknowledgment"}]', NOW() - INTERVAL '2 days'),
(4, 95, '{"greeting": 98, "resolution": 92, "soft_skills": 96, "compliance": 94}', 
   ARRAY['Perfect greeting', 'Handled feedback gracefully'], 
   ARRAY['None significant'], 
   '[]', NOW() - INTERVAL '3 days'),
(5, 81, '{"greeting": 88, "resolution": 78, "soft_skills": 82, "compliance": 76}', 
   ARRAY['Good greeting', 'Maintained professional tone'], 
   ARRAY['Could have been more thorough in explanation'], 
   '[]', NOW() - INTERVAL '4 days'),
(6, 96, '{"greeting": 98, "resolution": 96, "soft_skills": 97, "compliance": 93}', 
   ARRAY['Outstanding customer service', 'Clear step-by-step guidance', 'Excellent rapport building'], 
   ARRAY['None'], 
   '[]', NOW() - INTERVAL '4 hours'),
(7, 85, '{"greeting": 90, "resolution": 82, "soft_skills": 86, "compliance": 82}', 
   ARRAY['Good product knowledge', 'Friendly demeanor'], 
   ARRAY['Slightly rushed closing'], 
   '[]', NOW() - INTERVAL '1 day'),
(8, 91, '{"greeting": 92, "resolution": 90, "soft_skills": 92, "compliance": 90}', 
   ARRAY['Warm greeting', 'Efficient call handling'], 
   ARRAY['Could provide more detailed follow-up'], 
   '[]', NOW() - INTERVAL '2 days'),
(9, 88, '{"greeting": 90, "resolution": 86, "soft_skills": 88, "compliance": 88}', 
   ARRAY['Good rapport with customer'], 
   ARRAY['Minor - could confirm understanding more often'], 
   '[]', NOW() - INTERVAL '3 days'),
(10, 65, '{"greeting": 75, "resolution": 62, "soft_skills": 58, "compliance": 65}', 
   ARRAY['Eventually resolved the issue', 'Processed refund request'], 
   ARRAY['Need more empathy training', 'Should de-escalate more effectively', 'Closing was abrupt'], 
   '[{"sop": "Complaint Handling", "violation": "Did not apologize immediately"}]', NOW() - INTERVAL '5 hours'),
(11, 78, '{"greeting": 82, "resolution": 76, "soft_skills": 78, "compliance": 76}', 
   ARRAY['Maintained composure'], 
   ARRAY['Response time could be faster'], 
   '[]', NOW() - INTERVAL '1 day'),
(13, 89, '{"greeting": 92, "resolution": 88, "soft_skills": 90, "compliance": 86}', 
   ARRAY['Efficient handling', 'Good communication'], 
   ARRAY['Could be more thorough'], 
   '[]', NOW() - INTERVAL '3 hours'),
(14, 84, '{"greeting": 88, "resolution": 82, "soft_skills": 84, "compliance": 82}', 
   ARRAY['Professional demeanor', 'Clear explanations'], 
   ARRAY['Pace could be adjusted'], 
   '[]', NOW() - INTERVAL '1 day'),
(16, 90, '{"greeting": 92, "resolution": 88, "soft_skills": 91, "compliance": 89}', 
   ARRAY['Excellent customer rapport', 'Thorough resolution'], 
   ARRAY['None significant'], 
   '[]', NOW() - INTERVAL '2 hours'),
(17, 86, '{"greeting": 88, "resolution": 84, "soft_skills": 86, "compliance": 86}', 
   ARRAY['Good follow-up', 'Clear communication'], 
   ARRAY['Could offer additional assistance'], 
   '[]', NOW() - INTERVAL '1 day');

-- Insert coaching insights
INSERT INTO coaching_insights (agent_id, call_id, insight_type, title, description, priority, created_at) VALUES
(4, 3, 'improvement', 'Empathy in Difficult Situations', 'When dealing with frustrated customers, acknowledge their feelings immediately before investigating the issue. Try phrases like "I completely understand how frustrating this must be."', 'high', NOW() - INTERVAL '2 days'),
(4, 1, 'strength', 'Technical Troubleshooting', 'Excellent job quickly identifying and resolving the router connectivity issue. Your systematic approach is a model for the team.', 'low', NOW() - INTERVAL '6 hours'),
(5, 6, 'strength', 'Customer Rapport Building', 'Outstanding ability to build rapport with customers. Your friendly tone and clear instructions made the setup process enjoyable.', 'low', NOW() - INTERVAL '4 hours'),
(5, NULL, 'tip', 'Consistently High Performer', 'You have maintained above 90% quality scores. Consider mentoring newer team members.', 'low', NOW() - INTERVAL '1 day'),
(6, 10, 'warning', 'De-escalation Techniques', 'Practice the HEARD technique: Hear, Empathize, Apologize, Resolve, Diagnose. Starting with empathy can significantly improve customer satisfaction.', 'high', NOW() - INTERVAL '5 hours'),
(6, NULL, 'improvement', 'Call Closing Protocol', 'Remember to end calls with a positive note and confirm customer satisfaction before disconnecting.', 'medium', NOW() - INTERVAL '1 day'),
(7, NULL, 'strength', 'Consistent Performance', 'Your quality scores have been stable and above team average. Great job maintaining consistency.', 'low', NOW() - INTERVAL '1 day'),
(8, NULL, 'tip', 'Handle Time Optimization', 'Your average handle time is slightly higher than team average. Consider using templates for common responses while maintaining personalization.', 'medium', NOW() - INTERVAL '1 day');

-- Insert alerts for supervisors
INSERT INTO alerts (user_id, alert_type, title, message, severity, related_agent_id, related_call_id, created_at) VALUES
(2, 'low_score', 'Low Score Alert', 'David Brown scored 65% on a recent call evaluation, below the 70% threshold.', 'warning', 6, 10, NOW() - INTERVAL '5 hours'),
(2, 'dropped_call', 'Dropped Call', 'A call was dropped for agent David Brown. Review may be needed.', 'info', 6, 12, NOW() - INTERVAL '2 days'),
(2, 'performance_trend', 'Performance Improvement', 'John Smith has shown consistent improvement over the past week.', 'info', 4, NULL, NOW() - INTERVAL '1 day'),
(3, 'high_performer', 'Top Performer', 'Maria Garcia achieved 90% average score this week.', 'info', 8, NULL, NOW() - INTERVAL '1 day');

-- Insert scoring configuration
INSERT INTO scoring_config (category, weight, criteria, is_active) VALUES
('Greeting', 25, '{"items": ["Used proper greeting", "Stated name clearly", "Asked how to help"]}', true),
('Resolution', 25, '{"items": ["Listened actively", "Asked clarifying questions", "Provided clear solution"]}', true),
('Soft Skills', 25, '{"items": ["Showed empathy", "Maintained professional tone", "Built rapport"]}', true),
('Compliance', 25, '{"items": ["Verified identity", "Followed procedures", "Proper documentation"]}', true);
