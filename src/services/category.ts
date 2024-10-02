import {
   Brand,
   Category,
   CategoryAttribute,
   CategorySlider,
   Slider,
   SliderImage,
} from "../models";
import { generateId } from "../system/helper";

type JsonCategory = {
   name: string;
   brands: string[];
   attributes: string[];
};

class CategoryService {
   async findOne(id: number) {
      return await Category.findByPk(id, {
         include: [
            Category.associations.brands,
            Category.associations.attributes,
            Category.associations.price_ranges,
            {
               model: CategorySlider,
               as: "category_slider",
               include: [
                  {
                     model: Slider,
                     as: "slider",
                     include: [
                        {
                           model: SliderImage,
                           as: "slider_images",
                        },
                     ],
                  },
               ],
            },
         ],
      });
   }

   async add(body: Category) {
      const category = await Category.create(body);

      // create slider
      const slider = await Slider.create({
         name: `slider for ${category.name}`,
      });

      await CategorySlider.create({
         category_id: category.id,
         slider_id: slider.id,
      });

      const newCategory = await this.findOne(category.id);

      return newCategory;
   }

   async import(categories: JsonCategory[]) {
      const newCategories: Category[] = [];

      for (const c of categories) {
         const foundedCategory = await Category.findOne({
            where: {
               name_ascii: generateId(c.name),
            },
         });

         if (foundedCategory) continue;

         /** crate category */
         const newCategory = await new Category({
            name: c.name,
            name_ascii: generateId(c.name),
            attribute_order: "",
            hidden: false,
         }).save();

         /** slider */
         const slider = await Slider.create({
            name: `slider for ${c.name}`,
         });

         await CategorySlider.create({
            category_id: newCategory.id,
            slider_id: slider.id,
         });

         /** brands */
         const brandSchemas = c.brands.map(
            (b) =>
               ({
                  category_id: newCategory.id,
                  image_url: "",
                  name: b,
                  name_ascii: generateId(b),
               } as Brand)
         );

         await Brand.bulkCreate(brandSchemas);

         /** brands */
         const attributeSchemas = c.attributes.map(
            (a) =>
               ({
                  category_id: newCategory.id,
                  name: a,
                  name_ascii: generateId(a),
               } as CategoryAttribute)
         );

         const newAttributes = await CategoryAttribute.bulkCreate(
            attributeSchemas
         );

         const attributeOrder = newAttributes.map((a) => a.id);

         await newCategory.set("attribute_order", attributeOrder.join("_")).save()

         const _newCategory = await this.findOne(newCategory.id);

         if (_newCategory) newCategories.push(_newCategory);
      }

      return newCategories;
   }
}

export default new CategoryService();
