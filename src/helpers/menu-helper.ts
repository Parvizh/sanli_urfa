import { HttpService } from "@nestjs/axios";
import Redis from "ioredis";
import { CreateProductDto } from "src/menu/dto/create-product.dto";

export type CategoryData = {
  name: string;
  categoryId: string;
  products: CreateProductDto[];
}

export type BackupResponse = {
  parsedMenu: CategoryData[] | null;
  response: any;
}

export const backupMenu: (redisClient: Redis) => Promise<any> = async (redisClient: Redis) => {
  try {
    const httpService = new HttpService();

    const tokenPayload = JSON.stringify({ apiLogin: "a987e0fb-60c" });
    const tokenResponse = await httpService.axiosRef.post("https://api-ru.iiko.services/api/1/access_token", tokenPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    const token = tokenResponse.data.token;

    const menuPayload = JSON.stringify({
      externalMenuId: 6295,
      organizationIds: ["74fcde70-cba6-4d6c-9210-dc48712f6f1e"],
      priceCategoryId: null
    });
    const menuParams = { page: 1, item: 2 };
    const menuResponse = await httpService.axiosRef.post("https://api-ru.iiko.services/api/2/menu/by_id", menuPayload, {
      params: menuParams,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    let parsedMenu = null
    if (menuResponse) {
      const menu: any = menuResponse.data;
      parsedMenu = parseMenu(menu.itemCategories);
      await redisClient.set("menu", JSON.stringify(menuResponse.data));
    }

    return { parsedMenu, reponse: menuResponse };
  } catch (err) {
    console.log("Error while doing backup.");
    console.log(err);
  }
};

export const randomSelection = (originalArray: [{}], n: number) => {
  let newArr = [];

  if (n >= originalArray.length) {
    return originalArray;
  }

  for (let i = 0; i < n; i++) {
    let newElem = originalArray[Math.floor(Math.random() * originalArray.length)];
    while (newArr.includes(newElem)) {
      newElem = originalArray[Math.floor(Math.random() * originalArray.length)];
    }
    newArr.push(newElem);
  }

  return newArr;
}

const parseMenu = (menu: any[]) => {
  if (!Array.isArray(menu)) return null;

  return menu.map(category => {
    const products = category.items.map((product: any) => {
      return {
        itemId: product.itemId,
        name: product.name
      }
    });

    return {
      categoryId: category.id,
      name: category.name,
      products
    }
  });
}
