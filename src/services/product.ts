import Category from "../models/category";
import CategoryAttribute from "../models/categoryAttribute";
import Color from "../models/color";
import DefaultVariantCombine from "../models/defaultVariantCombine";
import Image from "../models/image";
import Product from "../models/product";
import ProductSlider from "../models/productSlider";
import Slider from "../models/slider";
import SliderImage from "../models/sliderImage";
import Variant from "../models/variant";

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
