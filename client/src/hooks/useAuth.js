import { useSelector } from 'react-redux';

export const useAuth = () => {
    const { userInfo, isAuthenticated, accessToken } = useSelector((state) => state.auth);

    return {
        userInfo,
        isAuthenticated,
        accessToken,
        isAdmin: userInfo?.role === 'admin'
    };
};
