import csv
import os

ARCHIVO = "funciones.csv" "ventas.csv"

if os.path.exists(ARCHIVO):
    with open(ARCHIVO, newline="", encoding="utf-8") as f:
        contactos = list(csv.DictReader(f))

while True:
    print("\n===== MovieTime =====")
    print("1. Registrar Funcion")
    print("2. Elegir funcion")
    print("3. Comprar Boletos")
    print("5. Salir")

    op = input("Seleccione una opción: ")

    if op == "1":
        nombre = input("Nombre funcion: ")
        genero = input("genero: ")
        duracion = input("duracion: ")
    
    elif op == "2":
        
            print("===== SELECCIONA LA FUNCION =====")
            print("1. El conjuro 6")
            print("2. Rapidos y furiosos")
            print("3. El origen")
            print("4. La casa de los sustos")
    op = input("Seleccione una opcion: ")
  