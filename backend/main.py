from fastapi import FastAPI,File,UploadFile,Form, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json
import uvicorn
from crowd_prediciton4 import get_density

app = FastAPI()

bus_stops = {
    "BACKBAY BUS DEPOT": [72.81736081326508,18.909632149810452],
    "CSMT BUS STATION": [72.83546629750742,18.939040405797314],
    "BALLARD PIER BUS STOP": [72.84020140674173,18.937224713205794],
    "RANI LAXMIBAI BUS STATION SION": [72.8629790178698,19.04162909216262],
    "MARINE LINES BUS STATION": [72.82362936360565,18.94135227119705],
    "KHODADAD CIRCLE DADAR EAST": [72.84746099954292,19.01695428068996],
    "PRABODHANKAR THACKRAY UDAYAN SEWRI" :[72.8520096267587,18.998068277850976], 
    "VIRWANI ESTATE GOREGAON EAST BUS STOP": [72.85888044025228,19.170747929146984],
    "BORIVALI WEST BUS STATION" : [72.85663008118404,19.23068223117299], 
    "WADALA BUS DEPOT" : [72.85248891696155,19.01460290000002],
    "OSHIWARA BUS DEPOT" : [72.83707523455593,19.152928661869556], 
    "AGARKAR CHOWK BUS STOP ANDHERI EAST" : [72.84820817779712,19.118887794434833],
    "BANDRA WEST BUS DEPOT" : [72.83852774182463,19.053368849733268],
    "GHATKOPAR BUS DEPOT" : [72.91925245173387,19.08607790663372],
    "SAKI NAKA BUS STOP" : [72.88557616349726,19.10529084719511],
    "MAHIM BUS DEPOT" : [72.84036613592232,19.043073792972763], 
    "MULUND WEST BUS DEPOT" : [72.94675639034848,19.17552802117634],
    "VIKHROLI BUS DEPOT" : [72.91952638422788,19.10191789357874],
    "VILE PARLE BUS STAND" : [72.84466430474967,19.100463787719562],
    "PRIYADARSHANI PARK BUS STOP" : [72.87947420011628,19.052260887410764],
    "CHEMBUR BUS DEPOT" : [72.89329293369589,19.044577657695648],
    "KANJURMARG WEST BUS STATION" : [72.92864793094442,19.130652858629272], 
    "KURLA NEHRU NAGAR BUS DEPOT" : [72.88336005550829,19.058132358229276],
    "SANTACRUZ BUS DEPOT" : [72.83831246932138,19.09127141800914],
}

bus_clusters = {
    "cluster1": ['BACKBAY BUS DEPOT','CSMT BUS STATION','BALLARD PIER BUS STOP','MARINE LINES BUS STATION'],
    "cluster2": ['PRIYADARSHANI PARK BUS STOP'],
    "cluster3": ['WADALA BUS DEPOT','KHODADAD CIRCLE DADAR EAST','MAHIM BUS DEPOT'],
    "cluster4": ['AGARKAR CHOWK BUS STOP ANDHERI EAST','RANI LAXMIBAI BUS STATION SION','BANDRA WEST BUS DEPOT','PRABODHANKAR THACKRAY UDAYAN SEWRI'],
    "cluster5": ['SAKI NAKA BUS STOP','KURLA NEHRU NAGAR BUS DEPOT','CHEMBUR BUS DEPOT'],
    "cluster6": ['GHATKOPAR BUS DEPOT','VIKHROLI BUS DEPOT'],
    "cluster7": ['KANJURMARG WEST BUS STATION','MULUND WEST BUS DEPOT'],
    "cluster8": ['SANTACRUZ BUS DEPOT','VILE PARLE BUS STAND'],
    "cluster9": ['BORIVALI WEST BUS STATION','OSHIWARA BUS DEPOT','VIRWANI ESTATE GOREGAON EAST BUS STOP']
}

bus_routes = {
    "102": [["cluster1","cluster2","cluster3","cluster4"],["BACKBAY BUS DEPOT","AGARKAR CHOWK BUS STOP ANDHERI EAST"]],
    "201": [["cluster4","cluster3","cluster2","cluster1"],["AGARKAR CHOWK BUS STOP ANDHERI EAST","BACKBAY BUS DEPOT"]],
    "103": [["cluster4","cluster6","cluster5"],["AGARKAR CHOWK BUS STOP ANDHERI EAST","SAKI NAKA BUS STOP"]],
    "301": [["cluster5","cluster6","cluster4"],["SAKI NAKA BUS STOP","AGARKAR CHOWK BUS STOP ANDHERI EAST"]],
    "104": [["cluster4","cluster8","cluster9"],["AGARKAR CHOWK BUS STOP ANDHERI EAST",'BORIVALI WEST BUS STATION']],
    "401": [["cluster9","cluster8","cluster4"],["BORIVALI WEST BUS STATION","AGARKAR CHOWK BUS STOP ANDHERI EAST"]],
    "105": [["cluster5","cluster7","cluster8"],["SAKI NAKA BUS STOP",'SANTACRUZ BUS DEPOT']],
    "501": [["cluster8","cluster7","cluster5"],["SANTACRUZ BUS DEPOT","SAKI NAKA BUS STOP"]],
    "106": [["cluster1","cluster3","cluster7"],["BACKBAY BUS DEPOT","KANJURMARG WEST BUS STATION"]],
    "601": [["cluster7","cluster3","cluster1"],["KANJURMARG WEST BUS STATION","BACKBAY BUS DEPOT"]]
}

@app.post("/route")
async def routes(bus_number: str = Form(...)):
    try:
        bus_route = bus_routes[bus_number]
        bus_stops = []
        bus_stops.append(bus_route[1][0])
        for clusters in bus_route[0]:
            cluster_single = []
            for bus_stop in bus_clusters[clusters]:
                if bus_stop == bus_route[1][0]:
                    continue
                if bus_stop == bus_route[1][1]:
                    continue
                cluster_single.append(bus_stop)
            sorted_stops = await get_density(cluster_single)  
            for bus_stop in sorted_stops:
                bus_stops.append(bus_stop)
        bus_stops.append(bus_route[1][1])
        print(bus_stops) 
        return JSONResponse(content={"response":bus_stops,"success":True},status_code=200)
    except Exception as e:
        print(f"Error occurred in routes function {str(e)}")
        return JSONResponse(content={"response":f"Error occurred in routes function {str(e)}","success":False},status_code=500)