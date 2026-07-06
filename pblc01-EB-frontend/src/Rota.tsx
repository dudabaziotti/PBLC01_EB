import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import UsuariosPage from './pages/UsuariosPage';
import IngredientesPage from './pages/IngredientesPage';
import ReceitasPage from './pages/ReceitasPage';
import FichasTecnicasPage from './pages/FichasTecnicasPage';
import PrivateRoute from './routes/PrivateRoute';

export default function Rota() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<CadastroUsuario />} />

      <Route path="/" element={<Navigate to="/usuarios" />} />

      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <UsuariosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ingredientes"
        element={
          <PrivateRoute>
            <IngredientesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/receitas"
        element={
          <PrivateRoute>
            <ReceitasPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/fichas"
        element={
          <PrivateRoute>
            <FichasTecnicasPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}