import numpy as np
import pandas as pd

# Define the routes with their ETAs
routes = {
    "102": 1.67,  # 1 hour 40 minutes
    "201": 1.67,  # 1 hour 40 minutes
    "103": 1.83,  # 1 hour 50 minutes
    "301": 1.83,  # 1 hour 50 minutes
    "104": 1.67,  # 1 hour 40 minutes
    "401": 1.67,  # 1 hour 40 minutes
    "105": 1.83,  # 1 hour 50 minutes
    "501": 1.83,  # 1 hour 50 minutes
    "106": 1.67,  # 1 hour 40 minutes
    "601": 1.67   # 1 hour 40 minutes
}

# Work hours per day
work_hours_per_day = 18
rest_time = 0.5  # 30 minutes in hours
bus_frequency = 0.5  # 30 minutes in hours

# Calculation results
results = []

complete_Drivers = 0
complete_busses = 0

for bus_number, eta in routes.items():
    total_time_per_trip = eta + rest_time
    trips_per_driver_per_day = work_hours_per_day / total_time_per_trip
    buses_required = eta / bus_frequency
    drivers_per_bus = work_hours_per_day / total_time_per_trip
    total_drivers_required = buses_required * drivers_per_bus
    complete_Drivers += np.ceil(total_drivers_required)
    complete_busses += np.ceil(buses_required)
    results.append({
        "Bus Number": bus_number,
        "ETA (hours)": eta,
        "Total Time per Trip (hours)": total_time_per_trip,
        "Trips per Driver per Day": np.ceil(trips_per_driver_per_day),
        "Buses Required": np.ceil(buses_required),
        "Drivers per Bus": np.ceil(drivers_per_bus),
        "Total Drivers Required": np.ceil(total_drivers_required)
    })

print(results)
print(complete_busses)
print(complete_Drivers)