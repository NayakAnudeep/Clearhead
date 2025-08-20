#!/usr/bin/env python3
"""
ClearHead Local AI - ADHD-focused Task Organization
Runs locally with no internet required
"""

import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os
import sys

class ADHDTaskAnalyzer:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'hour_of_day', 'day_of_week', 'priority_high', 'priority_medium', 'priority_low',
            'category_work', 'category_personal', 'category_health', 'category_learning',
            'category_errands', 'category_home', 'category_finance', 'task_length_minutes',
            'energy_level', 'task_complexity', 'is_routine', 'days_since_created',
            'consecutive_completions', 'time_since_last_completion'
        ]
        
    def generate_adhd_training_data(self, n_samples=1000):
        """Generate simulated ADHD behavior data for training"""
        np.random.seed(42)  # For reproducible results
        
        data = []
        
        # ADHD behavior patterns
        adhd_patterns = {
            'hyperfocus_hours': [9, 10, 11, 20, 21, 22],  # Peak focus times
            'low_energy_hours': [13, 14, 15, 16],          # Post-lunch dip
            'preferred_categories': ['Learning', 'Personal'], # Interest-driven
            'avoided_categories': ['Finance', 'Errands'],    # Executive function challenges
            'optimal_task_length': 25,                      # Pomodoro-like
            'complexity_threshold': 6                       # Struggle with high complexity
        }
        
        for i in range(n_samples):
            # Generate realistic task data
            hour = np.random.choice(range(8, 23), p=self._get_hour_probabilities(adhd_patterns))
            day = np.random.randint(0, 7)
            
            # Priority distribution (ADHD users often struggle with prioritization)
            priority = np.random.choice(['high', 'medium', 'low'], p=[0.2, 0.3, 0.5])
            
            # Category selection
            category = self._select_category(adhd_patterns)
            
            # Task characteristics
            task_length = max(5, np.random.normal(adhd_patterns['optimal_task_length'], 15))
            energy_level = self._calculate_energy_level(hour, adhd_patterns)
            task_complexity = np.random.uniform(1, 10)
            is_routine = np.random.choice([0, 1], p=[0.7, 0.3])
            days_since_created = np.random.exponential(2)
            consecutive_completions = np.random.poisson(1)
            time_since_last = np.random.exponential(60)  # minutes
            
            # Calculate completion probability based on ADHD patterns
            completion_prob = self._calculate_adhd_completion_probability(
                hour, priority, category, task_length, energy_level, 
                task_complexity, is_routine, consecutive_completions, adhd_patterns
            )
            
            completed = np.random.random() < completion_prob
            
            data.append({
                'hour_of_day': hour,
                'day_of_week': day,
                'priority': priority,
                'category': category,
                'task_length_minutes': task_length,
                'energy_level': energy_level,
                'task_complexity': task_complexity,
                'is_routine': is_routine,
                'days_since_created': days_since_created,
                'consecutive_completions': consecutive_completions,
                'time_since_last_completion': time_since_last,
                'completed': completed
            })
        
        return pd.DataFrame(data)
    
    def _get_hour_probabilities(self, patterns):
        """Get probability distribution for hours based on ADHD patterns"""
        probs = np.ones(15) * 0.5  # 8-22 hours, base probability
        
        for hour in patterns['hyperfocus_hours']:
            if 8 <= hour <= 22:
                probs[hour - 8] = 2.0  # Higher probability during focus hours
        
        for hour in patterns['low_energy_hours']:
            if 8 <= hour <= 22:
                probs[hour - 8] = 0.2  # Lower probability during low energy
        
        return probs / probs.sum()
    
    def _select_category(self, patterns):
        """Select category based on ADHD preferences"""
        categories = ['Work', 'Personal', 'Health', 'Learning', 'Errands', 'Home', 'Finance']
        weights = []
        
        for cat in categories:
            if cat in patterns['preferred_categories']:
                weights.append(3.0)
            elif cat in patterns['avoided_categories']:
                weights.append(0.5)
            else:
                weights.append(1.0)
        
        weights = np.array(weights) / np.sum(weights)
        return np.random.choice(categories, p=weights)
    
    def _calculate_energy_level(self, hour, patterns):
        """Calculate energy level based on time and ADHD patterns"""
        base_energy = 5
        
        if hour in patterns['hyperfocus_hours']:
            energy = base_energy + np.random.normal(3, 1)
        elif hour in patterns['low_energy_hours']:
            energy = base_energy + np.random.normal(-2, 1)
        else:
            energy = base_energy + np.random.normal(0, 1.5)
        
        return max(1, min(10, energy))
    
    def _calculate_adhd_completion_probability(self, hour, priority, category, task_length, 
                                            energy_level, task_complexity, is_routine, 
                                            consecutive_completions, patterns):
        """Calculate completion probability based on ADHD-specific factors"""
        base_prob = 0.5
        
        # Time-based adjustments
        if hour in patterns['hyperfocus_hours']:
            base_prob += 0.3
        elif hour in patterns['low_energy_hours']:
            base_prob -= 0.3
        
        # Energy level impact (crucial for ADHD)
        base_prob += (energy_level - 5) * 0.08
        
        # Task length impact (ADHD users prefer shorter tasks)
        optimal_length = patterns['optimal_task_length']
        length_penalty = abs(task_length - optimal_length) / optimal_length
        base_prob -= length_penalty * 0.4
        
        # Complexity impact (executive function challenges)
        if task_complexity > patterns['complexity_threshold']:
            base_prob -= (task_complexity - patterns['complexity_threshold']) * 0.1
        
        # Category preferences
        if category in patterns['preferred_categories']:
            base_prob += 0.2
        elif category in patterns['avoided_categories']:
            base_prob -= 0.3
        
        # Priority impact (ADHD users often struggle with boring high-priority tasks)
        if priority == 'high' and category in patterns['avoided_categories']:
            base_prob -= 0.2  # High priority boring tasks are hard
        elif priority == 'low' and category in patterns['preferred_categories']:
            base_prob += 0.1  # Low priority interesting tasks get done
        
        # Routine bonus (structure helps ADHD)
        if is_routine:
            base_prob += 0.15
        
        # Momentum effect (hyperfocus can chain tasks)
        base_prob += min(0.3, consecutive_completions * 0.1)
        
        return max(0.05, min(0.95, base_prob))
    
    def prepare_features(self, df):
        """Convert task data to ML features"""
        features = pd.DataFrame()
        
        # Time features
        features['hour_of_day'] = df['hour_of_day'] / 23.0
        features['day_of_week'] = df['day_of_week'] / 6.0
        
        # Priority one-hot encoding
        features['priority_high'] = (df['priority'] == 'high').astype(int)
        features['priority_medium'] = (df['priority'] == 'medium').astype(int)
        features['priority_low'] = (df['priority'] == 'low').astype(int)
        
        # Category one-hot encoding
        categories = ['Work', 'Personal', 'Health', 'Learning', 'Errands', 'Home', 'Finance']
        for cat in categories:
            features[f'category_{cat.lower()}'] = (df['category'] == cat).astype(int)
        
        # Numerical features
        features['task_length_minutes'] = df['task_length_minutes'] / 120.0  # Normalize to 2 hours max
        features['energy_level'] = df['energy_level'] / 10.0
        features['task_complexity'] = df['task_complexity'] / 10.0
        features['is_routine'] = df['is_routine'].astype(int)
        features['days_since_created'] = np.log1p(df['days_since_created']) / 5.0  # Log scale
        features['consecutive_completions'] = np.tanh(df['consecutive_completions'] / 5.0)  # Saturating
        features['time_since_last_completion'] = np.tanh(df['time_since_last_completion'] / 480.0)  # 8 hours max
        
        return features
    
    def train_model(self, df=None):
        """Train the RandomForest model"""
        if df is None:
            print("Generating ADHD behavior training data...")
            df = self.generate_adhd_training_data(2000)
        
        print(f"Training on {len(df)} samples...")
        
        # Prepare features
        X = self.prepare_features(df)
        y = df['completed'].astype(int)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train RandomForest optimized for ADHD patterns
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=12,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'  # Handle any class imbalance
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_accuracy = self.model.score(X_train_scaled, y_train)
        test_accuracy = self.model.score(X_test_scaled, y_test)
        
        print(f"Training accuracy: {train_accuracy:.3f}")
        print(f"Test accuracy: {test_accuracy:.3f}")
        
        return {
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy,
            'feature_importance': dict(zip(self.feature_names, self.model.feature_importances_))
        }
    
    def predict_task_completion(self, tasks_data):
        """Predict completion probability for tasks"""
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        df = pd.DataFrame(tasks_data)
        X = self.prepare_features(df)
        X_scaled = self.scaler.transform(X)
        
        # Get probabilities for the positive class (completed=1)
        probabilities = self.model.predict_proba(X_scaled)[:, 1]
        
        return probabilities
    
    def get_task_recommendations(self, tasks_data, current_time=None):
        """Get ADHD-optimized task recommendations"""
        if current_time is None:
            current_time = datetime.now()
        
        # Predict completion probabilities
        probabilities = self.predict_task_completion(tasks_data)
        
        # Create recommendations with reasoning
        recommendations = []
        for i, (task, prob) in enumerate(zip(tasks_data, probabilities)):
            reasoning = self._generate_reasoning(task, prob, current_time)
            
            recommendations.append({
                'task_index': i,
                'completion_probability': float(prob),
                'reasoning': reasoning,
                'adhd_score': self._calculate_adhd_friendliness(task, current_time)
            })
        
        # Sort by ADHD-friendliness and completion probability
        recommendations.sort(
            key=lambda x: (x['adhd_score'], x['completion_probability']), 
            reverse=True
        )
        
        return recommendations[:3]  # Top 3 recommendations
    
    def _generate_reasoning(self, task, probability, current_time):
        """Generate human-readable reasoning for task recommendation"""
        reasons = []
        
        current_hour = current_time.hour
        
        # Time-based reasoning
        if current_hour in [9, 10, 11, 20, 21, 22]:
            reasons.append("Good time for focus and concentration")
        elif current_hour in [13, 14, 15, 16]:
            reasons.append("Consider easier tasks during this energy dip")
        
        # Energy and complexity
        energy = task.get('energy_level', 5)
        complexity = task.get('task_complexity', 5)
        
        if energy >= 7 and complexity <= 6:
            reasons.append("High energy + manageable complexity = good match")
        elif energy < 4 and complexity > 7:
            reasons.append("Low energy + high complexity may be challenging")
        
        # Task characteristics
        if task.get('is_routine'):
            reasons.append("Routine tasks are easier with ADHD")
        
        task_length = task.get('task_length_minutes', 30)
        if task_length <= 30:
            reasons.append("Short task fits ADHD attention span")
        elif task_length > 60:
            reasons.append("Long task - consider breaking into smaller chunks")
        
        # Category-based advice
        category = task.get('category', '')
        if category in ['Learning', 'Personal']:
            reasons.append("Interest-driven category - natural motivation")
        elif category in ['Finance', 'Errands']:
            reasons.append("Administrative task - consider pairing with reward")
        
        # Probability-based
        if probability > 0.7:
            reasons.append("High success likelihood - great momentum builder")
        elif probability < 0.3:
            reasons.append("Challenging task - consider postponing or modifying")
        
        return reasons[:3]  # Limit to top 3 reasons
    
    def _calculate_adhd_friendliness(self, task, current_time):
        """Calculate how ADHD-friendly a task is right now"""
        score = 0.5
        
        current_hour = current_time.hour
        
        # Time score
        if current_hour in [9, 10, 11, 20, 21, 22]:
            score += 0.3
        elif current_hour in [13, 14, 15, 16]:
            score -= 0.2
        
        # Task characteristics
        task_length = task.get('task_length_minutes', 30)
        if task_length <= 25:
            score += 0.2
        elif task_length > 60:
            score -= 0.3
        
        complexity = task.get('task_complexity', 5)
        if complexity <= 5:
            score += 0.2
        elif complexity > 7:
            score -= 0.3
        
        if task.get('is_routine'):
            score += 0.2
        
        # Interest-based categories
        category = task.get('category', '')
        if category in ['Learning', 'Personal']:
            score += 0.2
        elif category in ['Finance', 'Errands']:
            score -= 0.1
        
        return max(0, min(1, score))
    
    def save_model(self, filepath):
        """Save trained model and scaler"""
        if self.model is None:
            raise ValueError("No model to save!")
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load trained model and scaler"""
        if os.path.exists(filepath):
            model_data = joblib.load(filepath)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            print(f"Model loaded from {filepath}")
            return True
        return False

def process_clearhead_tasks(input_file, output_file, model_file='clearhead_model.joblib'):
    """Main function to process ClearHead tasks and generate AI recommendations"""
    
    analyzer = ADHDTaskAnalyzer()
    
    # Load or train model
    if not analyzer.load_model(model_file):
        print("Training new ADHD-optimized model...")
        metrics = analyzer.train_model()
        analyzer.save_model(model_file)
        print(f"Model training complete. Test accuracy: {metrics['test_accuracy']:.3f}")
    
    try:
        # Read tasks from React Native app
        with open(input_file, 'r') as f:
            app_data = json.load(f)
        
        tasks = app_data.get('tasks', [])
        
        if not tasks:
            result = {
                'success': False,
                'message': 'No tasks to analyze',
                'recommendations': []
            }
        else:
            # Convert ClearHead tasks to analyzer format
            analyzer_tasks = []
            current_time = datetime.now()
            
            for task in tasks:
                if task.get('completed', False):
                    continue  # Skip completed tasks
                
                # Calculate task characteristics
                created_date = datetime.fromtimestamp(task.get('createdAt', 0) / 1000)
                days_since_created = (current_time - created_date).days
                
                analyzer_task = {
                    'hour_of_day': current_time.hour,
                    'day_of_week': current_time.weekday(),
                    'priority': task.get('priority', 'medium'),
                    'category': task.get('category', 'Personal'),
                    'task_length_minutes': estimate_task_length(task.get('text', ''), task.get('description', '')),
                    'energy_level': estimate_current_energy(current_time.hour),
                    'task_complexity': estimate_task_complexity(task.get('text', ''), task.get('description', '')),
                    'is_routine': is_routine_task(task.get('text', '')),
                    'days_since_created': days_since_created,
                    'consecutive_completions': 0,  # Could be enhanced with app data
                    'time_since_last_completion': 60,  # Default 1 hour
                    'original_task': task
                }
                analyzer_tasks.append(analyzer_task)
            
            # Get AI recommendations
            recommendations = analyzer.get_task_recommendations(analyzer_tasks)
            
            # Format for React Native
            formatted_recommendations = []
            for rec in recommendations:
                original_task = analyzer_tasks[rec['task_index']]['original_task']
                formatted_recommendations.append({
                    'taskId': original_task['id'],
                    'completionProbability': rec['completion_probability'],
                    'adhdScore': rec['adhd_score'],
                    'reasoning': rec['reasoning'],
                    'suggestedOrder': len(formatted_recommendations) + 1
                })
            
            result = {
                'success': True,
                'message': f'Analyzed {len(analyzer_tasks)} incomplete tasks',
                'recommendations': formatted_recommendations,
                'timestamp': current_time.isoformat(),
                'model_info': {
                    'type': 'RandomForest ADHD-Optimized',
                    'features': len(analyzer.feature_names),
                    'trained_locally': True
                }
            }
        
        # Write results back to React Native
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"✅ AI analysis complete! Generated {len(result.get('recommendations', []))} recommendations")
        return True
        
    except Exception as e:
        error_result = {
            'success': False,
            'message': f'Error processing tasks: {str(e)}',
            'recommendations': []
        }
        
        with open(output_file, 'w') as f:
            json.dump(error_result, f, indent=2)
        
        print(f"❌ Error: {str(e)}")
        return False

def estimate_task_length(title, description):
    """Estimate task length based on text content"""
    word_count = len((title + ' ' + description).split())
    
    # Basic heuristics
    if word_count <= 5:
        return 15  # Quick task
    elif word_count <= 15:
        return 30  # Medium task
    elif word_count <= 30:
        return 60  # Longer task
    else:
        return 90  # Complex task

def estimate_task_complexity(title, description):
    """Estimate task complexity based on keywords"""
    text = (title + ' ' + description).lower()
    
    complex_keywords = ['analyze', 'research', 'plan', 'design', 'implement', 'review', 'budget', 'presentation']
    simple_keywords = ['call', 'email', 'clean', 'organize', 'buy', 'schedule']
    
    complexity = 5  # Default medium
    
    for keyword in complex_keywords:
        if keyword in text:
            complexity += 1
    
    for keyword in simple_keywords:
        if keyword in text:
            complexity -= 1
    
    return max(1, min(10, complexity))

def estimate_current_energy(hour):
    """Estimate current energy level based on time"""
    # Typical ADHD energy patterns
    if hour in [9, 10, 11]:
        return 8  # Morning peak
    elif hour in [14, 15]:
        return 7  # Afternoon
    elif hour in [20, 21]:
        return 6  # Evening focus
    elif hour in [13, 16, 17]:
        return 4  # Energy dips
    else:
        return 5  # Default

def is_routine_task(title):
    """Check if task is routine based on keywords"""
    routine_keywords = ['daily', 'weekly', 'routine', 'regular', 'habit', 'medication', 'exercise']
    title_lower = title.lower()
    return any(keyword in title_lower for keyword in routine_keywords)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python clearhead_ai.py <input_tasks.json> <output_recommendations.json>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    success = process_clearhead_tasks(input_file, output_file)
    sys.exit(0 if success else 1)