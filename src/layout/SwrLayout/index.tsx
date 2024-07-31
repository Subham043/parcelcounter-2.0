import { SWRConfig } from "swr";
import { ChildrenType } from "../../helper/types";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";


const SwrLayout: React.FC<ChildrenType> = ({children} : ChildrenType) => {
    const axiosPrivate = useAxiosPrivate();
    const fetcher = (url: string) => axiosPrivate.get(url).then((res) => res.data);

    return <SWRConfig
        value={{
        fetcher
        }}
      >
        {children}
    </SWRConfig>
};
  
  export default SwrLayout;