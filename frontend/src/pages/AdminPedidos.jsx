import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Admin.css'; 

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        // Llamamos a Laravel para traer la lista de ventas
        const response = await fetch('http://127.0.0.1:8000/api/pedidos');
        if (response.ok) {
          const data = await response.json();
          setPedidos(data);
        }
      } catch (error) {
        console.error("Error cargando pedidos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, []);

  return (
    <div className="admin-page" style={{ padding: '40px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#d4af37' }}>Panel de Control - Ventas Arboleda's</h2>
          <button onClick={() => navigate('/')} className="btn-secondary">Volver al restaurante</button>
        </div>

        <div className="admin-card" style={{ overflowX: 'auto' }}>
          {cargando ? (
            <h3 style={{ textAlign: 'center' }}>Cargando ventas... ⏳</h3>
          ) : pedidos.length === 0 ? (
            <h3 style={{ textAlign: 'center' }}>Todavía no hay ventas registradas.</h3>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #d4af37', color: '#555' }}>
                  <th style={{ padding: '15px 10px' }}>ID</th>
                  <th style={{ padding: '15px 10px' }}>Cliente</th>
                  <th style={{ padding: '15px 10px' }}>Producto</th>
                  <th style={{ padding: '15px 10px' }}>Total</th>
                  <th style={{ padding: '15px 10px' }}>Fecha</th>
                  <th style={{ padding: '15px 10px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id || pedido.pedido_id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>
                      #{pedido.id || pedido.pedido_id}
                    </td>
                    <td style={{ padding: '15px 10px' }}>
                      {pedido.cliente?.nombre || 'Desconocido'}
                    </td>
                    <td style={{ padding: '15px 10px' }}>
                      {pedido.producto?.nombre || `Producto #${pedido.producto_id}`}
                    </td>
                    <td style={{ padding: '15px 10px', color: '#2e7d32', fontWeight: 'bold' }}>
                      ${parseFloat(pedido.total).toLocaleString()} COP
                    </td>
                    <td style={{ padding: '15px 10px' }}>
                      {pedido.fecha}
                    </td>
                    <td style={{ padding: '15px 10px' }}>
                      <span style={{
                        background: pedido.estado === 'pagado' ? '#e8f5e9' : '#fff3e0',
                        color: pedido.estado === 'pagado' ? '#2e7d32' : '#e65100',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {pedido.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}