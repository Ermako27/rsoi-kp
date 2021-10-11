import { ILocalStorage } from '../interfaces/ILocalStorage';
import { IUserModel, UserRoles} from '../interfaces/IUser';

const isLogin = () => {
    const value = localStorage.getItem(ILocalStorage.IS_LOGIN);
    return Boolean(Number(value));
}

const isAdmin = () => {
    const userData = localStorage.getItem(ILocalStorage.USER_DATA);

    if (userData) {
        const data = JSON.parse(userData);
        return data.role === UserRoles.ADMIN
    }

    return false
}

const getUserData = (): IUserModel => {
    const userData = localStorage.getItem(ILocalStorage.USER_DATA) as string;
    return JSON.parse(userData);
}

const logout = () => {
    localStorage.removeItem(ILocalStorage.USER_DATA);
    localStorage.removeItem(ILocalStorage.IS_LOGIN);
}

export const store = {
    isLogin,
    isAdmin,
    getUserData,
    logout
}