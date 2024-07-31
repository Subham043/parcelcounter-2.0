import { IonCol, IonRow } from '@ionic/react';
import './CategorySection.css';
import LoadingCard from '../../components/LoadingCard';
import { api_routes } from '../../helper/routes';
import { CategoryType } from '../../helper/types';
import CategoryCard2 from '../CategoryCard/CategoryCard2';
import RowHeading from '../RowHeading';
import NoData from '../NoData';
import useSWR from 'swr';

const PAGE_SIZE = 15;

const CategorySection: React.FC<{inHomePage?:boolean}> = ({inHomePage=true}) => {

    const { data, isLoading } = useSWR<{data: CategoryType[]}>(`${api_routes.categories}?total=${PAGE_SIZE}&sort=id`);
    
    return (
        <>
            <RowHeading text='What are you looking for?' link='/category' inHomePage={inHomePage} />
            <div className={`page-padding section-container`}>
                {
                    (isLoading && data===undefined) && <LoadingCard itemCount={6} column={4} />
                }
                {
                    (!isLoading && data && data.data.length===0) && <NoData message='No category is available!' />
                }
                <IonRow className="ion-align-items-start ion-justify-content-start mb-2">
                    {
                        (data ? data.data: []).map((item, i) =>  <IonCol
                            size="6"
                            size-xl="3"
                            size-lg="3"
                            size-md="4"
                            size-sm="4"
                            size-xs="4"
                            key={i}
                        >
                            <CategoryCard2 image={item.image} text={item.name} link={item.sub_categories.length>0 ? `/sub-category?category_slug=${item.slug}` : `/product?category_slug=${item.slug}`}  />
                        </IonCol>)
                    }
                </IonRow>
            </div>
        </>
    );
};

export default CategorySection;
