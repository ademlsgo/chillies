jest.mock('../models/cocktail', () => ({
  Cocktail: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

const {
  getAllCocktails,
  getCocktailById,
  createCocktail,
  updateCocktail,
  deleteCocktail,
} = require('../controllers/cocktailController');
const { Cocktail } = require('../models/cocktail');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('cocktailController', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAllCocktails returns list', async () => {
    const res = mockRes();
    Cocktail.findAll.mockResolvedValue([{ id: 1 }]);
    await getAllCocktails({}, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('getCocktailById 404 when missing', async () => {
    const res = mockRes();
    Cocktail.findByPk.mockResolvedValue(null);
    await getCocktailById({ params: { id: 999 } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('createCocktail returns 201 and object', async () => {
    const res = mockRes();
    Cocktail.create.mockResolvedValue({ id: 10 });
    await createCocktail({ body: { name: 'X' } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 10 });
  });

  it('updateCocktail 404 when not found', async () => {
    const res = mockRes();
    Cocktail.update.mockResolvedValue([0]);
    await updateCocktail({ params: { id: 5 }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('deleteCocktail 204 on success', async () => {
    const res = mockRes();
    Cocktail.destroy.mockResolvedValue(1);
    await deleteCocktail({ params: { id: 5 } }, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});

