import pandas as pd
from datetime import datetime

# Load the dataset with the correct header row
file_path = 'C:\\Users\\Anand\\Downloads\\Book1 (1).xlsx'
df = pd.read_excel(file_path, header=0)

# Print the column names to debug
print("Column names in the dataset:", df.columns)

# Map the time slot columns to a dictionary
time_slots = {
    (6, 9): '6am-9am',
    (9, 12): '9am-12pm',
    (12, 15): '12pm-3pm',
    (15, 18): '3pm-6pm',
    (18, 21): '6pm-9pm',
    (21, 24): '9pm-12am',
}

# Function to get the current time slot
def get_current_time_slot(current_hour):
    for (start, end), column in time_slots.items():
        if start <= current_hour < end:
            print("column:",column)
            return column
    return None

# Ask for the bus stop name
bus_stop_name = input("Enter the bus stop name: ")

# Get the current date and time
now = datetime.now()
current_day = now.strftime("%A").upper()  # Get the current day of the week in uppercase
current_hour = now.hour  # Get the current hour of the day

# Find the current time slot
#current_time_slot = get_current_time_slot(current_hour)   COMMENTED THE ACTUAL TIME LINE


current_time_slot = '9am-12pm'

if current_time_slot is None:
    print("The current time is outside the defined time slots.")
else:
    # Filter the dataframe for the specified bus stop and day of the week
    bus_stop_col = 'busstops'
    day_col = 'day'

    # Strip any leading/trailing spaces from column names
    df.columns = df.columns.str.strip()

    filtered_df = df[(df[bus_stop_col] == bus_stop_name) & (df[day_col].str.upper() == current_day)]
    
    if filtered_df.empty:
        print(f"No data found for bus stop '{bus_stop_name}' on {current_day}.")
    else:
        # Get the crowd density for the current time slot
        crowd_density = filtered_df.iloc[0][current_time_slot]
        print(f"The crowd density at '{bus_stop_name}' on {current_day} during {current_time_slot} is {crowd_density}/100 sq.meters")
