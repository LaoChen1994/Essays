class City {
  constructor(name) {
    this.name = name;
    this.routes = [];
  }

  addRoute(city, price) {
    this.routes.push({
      city,
      price,
    });

    return this;
  }
}

const Atlanta = new City("Atlanta");
const Boston = new City("Bostan");
const Denvor = new City("Denvor");
const Chicago = new City("Chicago");
const ElPaso = new City("ElPaso");

Atlanta.addRoute(Boston, 100).addRoute(Denvor, 160);
Boston.addRoute(Chicago, 120).addRoute(Denvor, 180);
Denvor.addRoute(Chicago, 40).addRoute(ElPaso, 140);
Chicago.addRoute(ElPaso, 80);
ElPaso.addRoute(Boston, 100);

// 这个可以经过所有经过的路线
const pathRlt = {};

function dijkstra(startCity) {
  let nextCity = { city: startCity, price: 0, prePath: "", preCityPrice: 0 };
  const hasArrived = [];
  const priceRlt = {};
  const nextCities = [];

  while (nextCity) {
    const currentCityName = nextCity.city.name;
    const currentCityPrice = nextCity.price;
    const currentPrePath = nextCity.prePath;
    const currentPrePrice = nextCity.preCityPrice;
    const rltCity = priceRlt[currentCityName];

    const routes = nextCity.city.routes;
    let cityPrice = Number.MAX_SAFE_INTEGER;
    const priceSum = currentCityPrice + currentPrePrice;

    // 去目的地最佳的价格保存起来
    if (!rltCity) {
      cityPrice = priceRlt[currentCityName] = priceSum;
    } else {
      cityPrice = priceRlt[currentCityName] = Math.min(
        priceRlt[nextCity.city.name],
        priceSum
      );
    }

    // 记录当前节点之前的路线
    const nextPath = currentPrePath || currentCityName;
    // 这里可以记录所有路线的经过
    pathRlt[nextPath] = cityPrice;

    // prePath需要重置
    nextCities.push(
      ...routes.map((item) => ({
        ...item,
        prePath: nextPath,
        preCityPrice: priceSum,
      }))
    );

    // 已走过的路线需要被记录
    hasArrived.push(nextPath);
    // 下一个需要遍历的节点
    let _nextCity = nextCities.shift();
    preCityPrice = cityPrice;
    const composePrePath = `${_nextCity.prePath}_${_nextCity.city.name}`;

    nextCity =
      // 没有走过这条路线
      !hasArrived.includes(composePrePath) &&
      // 这条路线中没有走到过这个城市
      (!_nextCity.prePath.includes(_nextCity.city.name) ||
        _nextCity.prePath.indexOf(_nextCity.city.name) ===
          nextPath.length - _nextCity.city.name.length)
        ? _nextCity
        : null;

    if (!nextCity) {
      // 该节点已经被经过则重新更换节点
      nextCity = nextCities.shift();
    } else {
      nextCity = { ...nextCity, prePath: composePrePath };
    }
  }

  return priceRlt;
}

const rlt = dijkstra(Atlanta, [Boston, Denvor, Chicago, ElPaso]);

console.log(rlt);
