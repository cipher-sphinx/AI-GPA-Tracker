import pandas as pd
import numpy as np
import pickle # used for load/Store models
import sys
import warnings

# Suppress warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=UserWarning, module="lightgbm")

# Get user inputs

absent_options = ["Not-At-All", "Rarely", "Frequently", "Mostly"]
health_status_options = ["Excellent", "Good", "Fair", "Poor", "Critical"]
financial_status_options = ["Poor", "Below-Average", "Average", "Above-Average", "Comfortable", "Well-Off"]
alcohol_consumption_options = ["Daily", "Regularly", "Moderately", "Occasionally", "Rarely", "Not-Drinking"]
student_gender_options = ["Male", "Female"]
study_mode_options = ["Full-Time", "Part-Time"]
repeated_options = ["Yes", "No"]
extra_support_options = ["Yes", "No"]

model_path = sys.argv[1]

# Load the pickle model
with open(model_path, 'rb') as model:
    loaded_model = pickle.load(model)


absent = sys.argv[2]
health_status = sys.argv[3]
financial_status = sys.argv[4]
alcohol_consumption = sys.argv[5]
student_gender = sys.argv[6]
study_mode = sys.argv[7]
repeated = sys.argv[8]
extra_support = sys.argv[9]
student_age = int(sys.argv[10])
study_time = float(sys.argv[11])
first_year_average = float(sys.argv[12])
second_year_average = float(sys.argv[13])
        
        
# create a dictionary of data
student_data = { 'Absent' : [absent],
                'Health Status' : [health_status],
                'Alcohol Consumption' : [alcohol_consumption],
                'Financial Status' : [financial_status],
                'Student Gender' : [student_gender],
                'Mode of Study' : [study_mode],
                'Repeated' : [repeated],
                'Extra Support Taken by University' : [extra_support],
                'Student Age' : [student_age],
                'Study Time Allocated' : [study_time],
                'First Year Average' : [first_year_average],
                'Second Year Average' : [second_year_average]
                }

# create a DataFrame from the dictionary
student = pd.DataFrame(student_data)

##------------------------------------------------ Feature Engineering to send features according to model --------------------------------------------------
# Feature Creation
# Creating Student Age Group 
def age_group(df):
    age_group  = []
    for i in df["Student Age"]:
        if (i<=19):
            age_group.append("Age_19-")
        elif (i==20):
            age_group.append("Age_20")
        elif (i==21):
            age_group.append("Age_21")
        elif (i==22):
            age_group.append("Age_22")
        elif (i==23):
            age_group.append("Age_23")
        elif (i==24):
            age_group.append("Age_24")
        elif (i==25):
            age_group.append("Age_25")
        elif (i>=26):
            age_group.append("Age_26+")

    df["Age Group"] = age_group

age_group(student)


# Creating Study Time Allocated Group 
def study_time_group(df):
    study_time_group  = []
    for i in df["Study Time Allocated"]:
        if (i<1):
            study_time_group.append("Less than 1 hour")
        elif (i>=1 and i<=5):
            study_time_group.append("around 1 hour")
        elif (i>5 and i<=10):
            study_time_group.append("1-2 hours")
        elif (i>10 and i<=15):
            study_time_group.append("2-3 hours")
        elif (i>15 and i<=20):
            study_time_group.append("3-4 hours")
        elif (i>20):
            study_time_group.append("More than 4 hours")

    df["Study Time Group"] = study_time_group
    
study_time_group(student)

# Creating First Year Average Creating
def first_year_average_group(df):
    first_group  = []
    for i in df["First Year Average"]:
        if (i>=70):
            first_group.append("First")
        elif (i<70 and i>=60):
            first_group.append("Upper Second")
        elif (i<60 and i>=50):
            first_group.append("Lower Second")
        elif (i<50 and i>=40):
            first_group.append("Third")
        elif (i<40):
            first_group.append("Refer")

    df["First Year Average Group"] = first_group
    
first_year_average_group(student)


# Creating Second Year Average Group
def second_year_average_group(df):
    second_group  = []
    for i in df["Second Year Average"]:
        if (i>=70):
            second_group.append("First")
        elif (i<70 and i>=60):
            second_group.append("Upper Second")
        elif (i<60 and i>=50):
            second_group.append("Lower Second")
        elif (i<50 and i>=40):
            second_group.append("Third")
        elif (i<40):
            second_group.append("Refer")

    df["Second Year Average Group"] = second_group
    

second_year_average_group(student)


# Feature Transformation
# Power Transformation
def power_transform_and_display(df, column_name, power_value):
    df[column_name + " Powered"] = np.power(df[column_name], power_value)
    df[column_name + " Powered"] = df[column_name + " Powered"].astype('float64')  # Convert to float64

# Power transformations and display for multiple columns
columns_to_transform = [
    ("Study Time Allocated", 1.788),
    ("First Year Average", 1.325),
    ("Second Year Average", 1.106)
]

for column_name, power_value in columns_to_transform:
    power_transform_and_display(student, column_name, power_value)


# Feature Encoding

# Student Gender One Hot Encoding
if (student['Student Gender'] == 'Male').any :
    student['Student Gender_Male'] = 1
    student['Student Gender_Female'] = 0
elif (student['Student Gender'] == 'Female').any :
    student['Student Gender_Male'] = 0
    student['Student Gender_Female'] = 1

student[['Student Gender_Male', 'Student Gender_Female']] = student[['Student Gender_Male', 'Student Gender_Female']].astype('uint8')

# Mode of Study One Hot Encoding
if (student['Mode of Study'] == 'Full-Time').any :
    student['Mode of Study_Full-Time'] = 1
    student['Mode of Study_Part-Time'] = 0
elif (student['Mode of Study'] == 'Part-Time').any :
    student['Mode of Study_Full-Time'] = 0
    student['Mode of Study_Part-Time'] = 1

student[['Mode of Study_Full-Time', 'Mode of Study_Part-Time']] = student[['Mode of Study_Full-Time', 'Mode of Study_Part-Time']].astype('uint8')

# Repeated One Hot Encoding
if (student['Repeated'] == 'Yes').any :
    student['Repeated_Yes'] = 1
    student['Repeated_No'] = 0
elif (student['Repeated'] == 'No').any :
    student['Repeated_Yes'] = 0
    student['Repeated_No'] = 1

student[['Repeated_Yes', 'Repeated_No']] = student[['Repeated_Yes', 'Repeated_No']].astype('uint8')

# Extra Support Taken by University One Hot Encoding
if (student['Extra Support Taken by University'] == 'Yes').any :
    student['Extra Support Taken by University_Yes'] = 1
    student['Extra Support Taken by University_No'] = 0
elif (student['Extra Support Taken by University'] == 'No').any :
    student['Extra Support Taken by University_Yes'] = 0
    student['Extra Support Taken by University_No'] = 1

student[['Extra Support Taken by University_Yes', 'Extra Support Taken by University_No']] = student[['Extra Support Taken by University_Yes', 'Extra Support Taken by University_No']].astype('uint8')


# Absent Label Encoding
encoding_dict_absent = {'Not-At-All' : 2, 'Rarely' : 3, 'Frequently' : 0, 'Mostly' : 1}
student['Absent'] = student['Absent'].map(encoding_dict_absent).astype('int64')

# Health Status Label Encoding
encoding_dict_health_status = {'Excellent' : 1, 'Good' : 3, 'Fair' : 2, 'Poor' : 4, 'Critical' : 0}
student['Health Status'] = student['Health Status'].map(encoding_dict_health_status).astype('int64')

# Financial Status Label Encoding
encoding_dict_financial_status = {'Poor': 4, 'Below-Average': 2, 'Average': 1, 'Above-Average': 0, 'Comfortable': 3, 'Well-Off': 5}
student['Financial Status'] = student['Financial Status'].map(encoding_dict_financial_status).astype('int64')

# Alcohol Consumption Label Encoding
encoding_dict_alcohol_consumption = {'Daily': 0, 'Regularly': 5, 'Moderately': 1, 'Occasionally': 3, 'Rarely': 4, 'Not-Drinking': 2}
student['Alcohol Consumption'] = student['Alcohol Consumption'].map(encoding_dict_alcohol_consumption).astype('int64')

# Age Group Label Encoding
encoding_dict_age_group = {'Age_19-' : 0, 'Age_20' : 1, 'Age_21' : 2, 'Age_22' : 3, 'Age_23' : 4, 'Age_24' : 5, 'Age_25' : 6, 'Age_26+' : 7}
student['Age Group'] = student['Age Group'].map(encoding_dict_age_group).astype('int64')

# Study Time Group Label Encoding
encoding_dict_study_time_group = {'Less than 1 hour' : 4, 'around 1 hour' : 3, '1-2 hours' : 0, '2-3 hours' : 1, '3-4 hours' : 2, 'More than 4 hours' : 5}
student['Study Time Group'] = student['Study Time Group'].map(encoding_dict_study_time_group).astype('int64')

# First Year Average Group Label Encoding
encoding_dict_first_year_average_group = {'First' : 0, 'Upper Second' : 2, 'Lower Second' : 1, 'Third' : 3, 'Refer' : 4}
student['First Year Average Group'] = student['First Year Average Group'].map(encoding_dict_first_year_average_group).astype('int64')

# Second Year Average Group Label Encoding
encoding_dict_second_year_average_group = {'First' : 0, 'Upper Second' : 2, 'Lower Second' : 1, 'Third' : 3, 'Refer' : 4}
student['Second Year Average Group'] = student['Second Year Average Group'].map(encoding_dict_second_year_average_group).astype('int64')


features = student[[ # label encoded ordinal categorical features
                    "Absent", "Health Status", "Financial Status", "Alcohol Consumption",
                    # hot encoded nominal categorical features
                    "Mode of Study_Full-Time", "Mode of Study_Part-Time", "Repeated_No", "Repeated_Yes", "Extra Support Taken by University_No", "Extra Support Taken by University_Yes", "Student Gender_Female", "Student Gender_Male",
                    # discrete numerical features
                    "Student Age",
                    # continuous numerical features
                    "Study Time Allocated", "First Year Average", "Second Year Average",
                    # newly created features by grouping - label encoded
                    "Age Group", "Study Time Group", "First Year Average Group", "Second Year Average Group",
                    # transformed existing features
                    "Study Time Allocated Powered", "First Year Average Powered", "Second Year Average Powered"]]

from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)


prediction = loaded_model.predict(scaled_features)

student['Third Year Average'] = prediction


prediction = round(prediction[0])

print(prediction)