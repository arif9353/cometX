import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN
from geopy.distance import great_circle
from geopy.point import Point
# Define the bus stops with their coordinates
bus_stops = {
    "CSMT BUS STATION": (72.83546629750742, 18.939040405797314),
    "BALLARD PIER BUS STOP": (72.84020140674173, 18.937224713205794),
    "RANI LAXMIBAI BUS STATION SION": (72.8629790178698, 19.04162909216262),
    "MARINE LINES BUS STATION": (72.82362936360565, 18.94135227119705),
    "BACKBAY BUS DEPOT": (72.81736081326508, 18.909632149810452),
    "KHODAD CIRCLE DADAR EAST": (72.84746099954292, 19.01695428068996),
    "PRABODHANKAR THACKRAY UDAYAN SEWRI": (72.8520096267587, 18.998068277850976),
    "VIRWANI ESTATE GOREGAON EAST BUS STOP": (72.85888044025228, 19.170747929146984),
    "BORIVALI WEST BUS STATION": (72.85663008118404, 19.23068223117299),
    "WADALA BUS DEPOT": (72.85248891696155, 19.01460290000002),
    "OSHIWARA BUS DEPOT": (72.83707523455593, 19.152928661869556),
    "AGARKAR CHOWK BUS STOP ANDHERI EAST": (72.84820817779712, 19.118887794434833),
    "BANDRA WEST BUS DEPOT": (72.83852774182463, 19.053368849733268),
    "GHATKOPAR BUS DEPOT": (72.91925245173387, 19.08607790663372),
    "SAKI NAKA BUS STOP": (72.88557616349726, 19.10529084719511),
    "MAHIM BUS DEPOT": (72.84036613592232, 19.043073792972763),
    "MULUND WEST BUS DEPOT": (72.94675639034848, 19.17552802117634),
    "VIKHROLI BUS DEPOT": (72.91952638422788, 19.10191789357874),
    "VILE PARLE BUS STAND": (72.84466430474967, 19.100463787719562),
    "PRIYADARSHANI PARK BUS STOP": (72.87947420011628, 19.052260887410764),
    "CHEMBUR BUS DEPOT": (72.89329293369589, 19.044577657695648),
    "KANJURMARG WEST BUS STATION": (72.92864793094442, 19.130652858629272),
    "KURLA NEHRU NAGAR BUS DEPOT": (72.88336005550829, 19.058132358229276),
    "SANTACRUZ BUS DEPOT": (72.83831246932138, 19.09127141800914),
}

# Convert to a DataFrame
bus_stops_df = pd.DataFrame(bus_stops).T
bus_stops_df.columns = ['longitude', 'latitude']

# Convert coordinates to radians
coords = np.radians(bus_stops_df[['latitude', 'longitude']])

# Define the DBSCAN model with epsilon as 3 km (converted to radians)
kms_per_radian = 6371.0088
epsilon = 2 / kms_per_radian

db = DBSCAN(eps=epsilon, min_samples=1, algorithm='ball_tree', metric='haversine').fit(coords)

# Extract the cluster labels
labels = db.labels_

# Add the labels to the DataFrame
bus_stops_df['cluster'] = labels

# Display the clusters
print(bus_stops_df)

# Group the bus stops by clusters
clusters = bus_stops_df.groupby('cluster').apply(lambda df: df.index.tolist()).tolist()
print(clusters)