import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../useAuth';
import { AddVacationModal } from '../modals/AddVacationModal';

interface StyledNavLinkProps {
  to: string;
  children: ReactNode;
}

const StyledNavLink = ({ to, children }: StyledNavLinkProps) => {
  return (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Button
          color="inherit"
          sx={{
            color: isActive ? 'primary.main' : 'text.primary',
            fontWeight: isActive ? 'bold' : 'normal',
            textTransform: 'none',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {children}
        </Button>
      )}
    </NavLink>
  );
};

const Header = () => {
  const { user, loading } = useAuth();
  const roleId = user?.role_id ?? null;

  const [modalOpen, setModalOpen] = useState(false);
  const handleModal = () => setModalOpen((prev) => !prev);

  const renderNavLinks = () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <StyledNavLink to="/">Главная</StyledNavLink>
      {(roleId === 1 || roleId === 2) && <StyledNavLink to="/users">Пользователи</StyledNavLink>}
      {(roleId === 1) && <StyledNavLink to="/departments">Отделы</StyledNavLink>}
      <StyledNavLink to="/vacations">Отпуска</StyledNavLink>
      
    </Box>
  );

  if (loading) return null;

  if (roleId !== null && ![1, 2, 3].includes(roleId)) {
    return null;
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          {roleId === 3 && (
            <Button variant="outlined" onClick={handleModal}>
              Заявки на отпуск
            </Button>
          )}

          {(roleId === 1 || roleId === 2) && <Box sx={{ ml: 'auto' }}>{renderNavLinks()}</Box>}
        </Toolbar>
      </AppBar>

      <AddVacationModal open={modalOpen} onClose={handleModal} />
    </>
  );
};

export default Header;