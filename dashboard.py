import streamlit as st
import requests
import plotly.graph_objects as go
import pandas as pd
from datetime import datetime

st.set_page_config(
    page_title="Discord Bot Dashboard",
    page_icon="🤖",
    layout="wide"
)

st.title("🤖 Panel de Control del Bot de Discord")

# Función para obtener datos del bot
def get_bot_status():
    try:
        response = requests.get('http://0.0.0.0:5000')
        return response.json()
    except:
        return None

# Contenedor principal
main = st.container()

with main:
    # Primera fila: Métricas principales
    col1, col2, col3 = st.columns(3)

    status_data = get_bot_status()

    if status_data:
        with col1:
            st.metric("Estado", status_data['status'])
        with col2:
            st.metric("Tiempo Activo", status_data['uptime'])
        with col3:
            memory_mb = status_data['memory']['heapUsed'] / 1024 / 1024
            st.metric("Memoria Usada", f"{memory_mb:.2f} MB")

        # Información del sistema
        st.subheader("💻 Información del Sistema")
        system_col1, system_col2 = st.columns(2)

        with system_col1:
            st.info(f"Plataforma: {status_data['platform']}")
            st.info(f"Node.js: {status_data['nodejs']}")

        with system_col2:
            st.info(f"Última actualización: {status_data['timestamp']}")

        # Gráfico de memoria
        st.subheader("📊 Uso de Memoria")
        memory_data = {
            'Tipo': ['Heap Usado', 'Heap Total', 'RSS'],
            'MB': [
                status_data['memory']['heapUsed'] / 1024 / 1024,
                status_data['memory']['heapTotal'] / 1024 / 1024,
                status_data['memory']['rss'] / 1024 / 1024
            ]
        }

        fig = go.Figure(data=[
            go.Bar(
                x=memory_data['Tipo'],
                y=memory_data['MB'],
                text=[f"{val:.2f} MB" for val in memory_data['MB']],
                textposition='auto',
            )
        ])

        fig.update_layout(
            title="Distribución de Memoria",
            yaxis_title="Megabytes (MB)",
            showlegend=False
        )

        st.plotly_chart(fig, use_container_width=True)

    else:
        st.error("❌ No se pudo conectar con el bot. Verifica que esté en ejecución.")

    # Botón de actualización
    if st.button("🔄 Actualizar Datos"):
        st.experimental_rerun()