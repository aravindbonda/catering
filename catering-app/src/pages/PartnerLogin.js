import { Navigate } from 'react-router-dom';

function PartnerLogin() {
  return <Navigate to="/login" replace state={{ role: 'partner' }} />;
}

export default PartnerLogin;
