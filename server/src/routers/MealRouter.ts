import { Router } from 'express';
import is from '@sindresorhus/is';
import { mealService, MealInfo } from '../services';
import { loginRequired } from '../middlewares';

const mealRouter = Router();

// 식단 리스트 반환 (전체)
mealRouter.get('/', async (req, res, next) => {
  try {
    const mealArticleListAll = await mealService.getAllMealArticle();

    res.status(200).json(mealArticleListAll);
  } catch (error) {
    next(error);
  }
});

// 식단 리스트 반환 (유저 별)
mealRouter.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const mealArticleList = await mealService.getMealArticleList(userId);

    res.status(200).json(mealArticleList);
  } catch (error) {
    next(error);
  }
});

// 식단 글 반환 (식단 글 object ID 이용)
mealRouter.get('/:userId/article', async (req, res, next) => {
  try {
    const { mealArticleId } = req.body;
    const mealArticle = await mealService.getMealArticleById(mealArticleId);

    res.status(200).json(mealArticle);
  } catch (error) {
    next(error);
  }
});

// 식단 글 등록
mealRouter.post('/register', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }

    const { meals } = req.body;

    const userId = req.currentUserId;

    if (!meals) {
      throw new Error('식단 등록은 필수 사항입니다.');
    }

    const mealArray = meals.map((meal: MealInfo[]) => {
      return {
        meal_list: meal,
      };
    });

    const toAddInfo = {
      userId,
      meals: mealArray,
    };

    const newMealArticle = await mealService.addMeal(toAddInfo);

    res.status(201).json(newMealArticle);
  } catch (error) {
    next(error);
  }
});

// 식단 글 수정
mealRouter.patch('/', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }

    const { mealArticleId, meals } = req.body;

    const userId = req.currentUserId;

    if (!mealArticleId) {
      throw new Error(
        '수정을 위해서는 해당 아티클의 ID(Object ID)가 필요합니다.'
      );
    }

    if (!meals) {
      throw new Error('수정할 식단을 입력해주세요.');
    }

    const toUpdateMeal = meals;

    const updatedMealInfo = await mealService.patchMeal(
      mealArticleId,
      userId,
      toUpdateMeal
    );

    res.status(200).json(updatedMealInfo);
  } catch (error) {
    next(error);
  }
});

// 식단 글 삭제
mealRouter.delete('/', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }

    const { mealArticleId } = req.body;

    const userId = req.currentUserId;

    const result = await mealService.deleteMealArticle(userId, mealArticleId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 식사 삭제
mealRouter.delete('/one', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요.'
      );
    }

    const { mealListId } = req.body;

    const userId = req.currentUserId;

    const result = await mealService.deleteOneMeal(userId, mealListId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export { mealRouter };
