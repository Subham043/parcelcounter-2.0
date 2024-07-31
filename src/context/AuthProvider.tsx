import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthType, ChildrenType } from "../helper/types";
import { GetResult, Preferences } from '@capacitor/preferences';
import { axiosPublic } from "../../axios";
import { api_routes } from "../helper/routes";
import { IonLoading } from "@ionic/react";

const authData = {
  authenticated: false,
  token: '',
  token_type: '',
  user: undefined
};

export type AType = {
  auth: AuthType;
}

export type AuthContextType = {
  auth: AuthType;
  setAuth: (data: AType) => void;
  logout: () => void;
}

const authDefaultValues: AuthContextType = {
  auth: authData,
  setAuth: (data: AType) => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(authDefaultValues);

const setAuthLocally = async(data: AType) => {
  await Preferences.set({
    key: 'auth',
    value: JSON.stringify(data)
  });
}

export const useAuth = () => useContext(AuthContext) as AuthContextType;

const AuthProvider: React.FC<ChildrenType> = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [auth, setAuthDetails] = useState<AType>({
      auth:authData
    });
    
    const getAuthFromPreferences = async() => {
      const ret:GetResult = await Preferences.get({ key: 'auth' });
      if(!ret.value) {
        return;
      }
    
      const auth:AType = await JSON.parse(ret.value);
      
      if(auth.auth.authenticated){
        await getUserDetails(auth)
        return;
      }
      
    }

    useEffect(() => {
      let isMounted = true;
      isMounted && getAuthFromPreferences();
      
      return () => {isMounted=false}
    }, [])

    useEffect(() => {
      let isMounted = true;
      const configSetter = async () => {
        try {
          setLoading(true);
          axiosPublic.interceptors.request.use(
            config => {
                if(!config.headers['authorization'] && auth.auth.authenticated===true){
                  config.headers['authorization'] = `Bearer ${auth.auth.token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
          );
        } catch (error) {} finally{
          setLoading(false);
        }
      }
      (isMounted && auth.auth.authenticated) && configSetter()
      return () => {isMounted=false}
    }, [auth.auth.authenticated])

    const getUserDetails = async (auth:AType):Promise<void> => {
      const headers = {
        headers: {
          "Authorization" : `Bearer ${auth.auth.token}`,
          "Accept": 'application/json'
        }
      }
      try {
        const response = await axiosPublic.get(api_routes.profile, headers);
        const data = {auth:{
          authenticated: auth.auth.authenticated,
          token: auth.auth.token,
          token_type: auth.auth.token_type,
          user: response.data.user
        }};
        axiosPublic.interceptors.request.use(
          config => {
              if(!config.headers['authorization'] && data.auth.authenticated===true){
                config.headers['authorization'] = `Bearer ${data.auth.token}`;
              }
              return config;
          },
          (error) => Promise.reject(error)
        ); 
        setAuth({...data})
      } catch (error) {}
    }
    

    const setAuth = async (data: AType) => {
      setAuthDetails({...data});
      await setAuthLocally({...data});
    }

    const logout = async () => {
      try {
          await setAuth({auth:authData})
      } catch (error) {}
    }
    
    return (
      <AuthContext.Provider value={{...auth, setAuth, logout}}>
          {children}
          <IonLoading isOpen={loading} message="Please wait..." spinner="crescent" />
      </AuthContext.Provider>
    );
}

export default AuthProvider;