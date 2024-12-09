import {
   Category,
   CategoryAttribute,
   Color,
   DefaultVariantCombine,
   Image,
   ProductSlider,
   Slider,
   SliderImage,
   Variant,
} from "../models";
import Product from "../models/product";

class ProductService {
   async findOne(id: number) {
      const product = await Product.findByPk(id, {
         include: [
            {
               model: Category,
               as: "category",
               include: [
                  {
                     model: CategoryAttribute,
                     as: "attributes",
                  },
               ],
            },
            {
               model: Variant,
               as: "variants",
               include: [
                  {
                     model: DefaultVariantCombine,
                     as: "default_combine",
                  },
               ],
            },
            Product.associations.default_variant,
            Product.associations.combines,
            {
               model: Color,
               as: "colors",
               include: [
                  {
                     model: ProductSlider,
                     as: "product_slider",
                     include: [
                        {
                           model: Slider,
                           as: "slider",
                           include: [
                              {
                                 model: SliderImage,
                                 as: "slider_images",
                                 include: [
                                    {
                                       model: Image,
                                       as: "image",
                                    },
                                 ],
                              },
                           ],
                        },
                     ],
                  },
               ],
            },
            Product.associations.attributes,
            Product.associations.description,
         ],
      });

      return product;
   }
}

export default new ProductService();
