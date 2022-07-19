/* eslint-disable no-underscore-dangle */
import { useNavigate } from 'react-router-dom';
import { useCallback, useRef, useEffect } from 'react';

import { IDiet } from 'types/interfaces';

import Modal from 'common/components/alert-modal';
import Loading from 'common/components/loading';
import MealCard from 'common/components/meal-card';

import useFood from 'pages/diet-page/hooks/useFood';
import useArticle from '../hook/useArticle';
import reduceMeal from '../util/reduceMeal';
import * as SC from './MealContainerStyle';

const MealContainer = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    articleList,
    errorMessage,
    isOpen,
    hasMore,
    setIsOpen,
    setReqNumber,
  } = useArticle<IDiet>('meal');

  const { food, getFood } = useFood();
  const reducedMealList = reduceMeal(articleList, food);

  useEffect(() => {
    getFood();
  }, []);

  const observer = useRef<IntersectionObserver>();
  const lastArticleRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setReqNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore]
  );

  const handleClick = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <SC.ContainerSection>
        {reducedMealList?.map((meal, index) => {
          if (reducedMealList.length === index + 2) {
            return (
              <div ref={lastArticleRef}>
                <MealCard key={Math.random()} data={meal} />
              </div>
            );
          }
          return <MealCard key={Math.random()} data={meal} />;
        })}
        {isOpen && <Modal message={errorMessage} handleConfirm={handleClick} />}
      </SC.ContainerSection>
      {isLoading && <Loading />}
    </>
  );
};

export default MealContainer;
