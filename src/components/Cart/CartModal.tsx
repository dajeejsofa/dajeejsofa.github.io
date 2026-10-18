'use client'

import { Price } from '@/components/Price'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'
import type { CartItem } from './index'
import { WhatsAppIcon } from '@/components/icons/whatsapp'
import type { Media, Product, Variant, VariantOption } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'
import { buildOrderLink, type WhatsAppOrderLine } from '@/lib/whatsappOrder'

type ResolvedLine = {
  key: string
  item: CartItem
  product: Product
  variant?: Variant
  image?: Media
  price?: number | null
  optionsLabel?: string
}

const variantOptionLabels = (variant: Variant) =>
  (variant.options || [])
    .map((option: string | VariantOption) => (typeof option === 'object' ? option.label : null))
    .filter(Boolean)
    .join('، ')

export function CartModal() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    // يغلق السلة عند الانتقال لصفحة أخرى
    setIsOpen(false)
  }, [pathname])

  const lines = useMemo<ResolvedLine[]>(() => {
    if (!cart?.items?.length) return []

    return cart.items.flatMap((item, i) => {
      const product = item.product
      if (!item || typeof product !== 'object' || !product?.slug) return []

      const typedProduct = product as Product
      const variant =
        item.variant && typeof item.variant === 'object' ? (item.variant as Variant) : undefined

      const metaImage =
        typedProduct.meta?.image && typeof typedProduct.meta.image === 'object'
          ? typedProduct.meta.image
          : undefined
      const firstGalleryImage =
        typeof typedProduct.gallery?.[0]?.image === 'object'
          ? typedProduct.gallery[0].image
          : undefined

      let image: Media | undefined = firstGalleryImage || metaImage
      let price = typedProduct.priceInKWD

      if (variant) {
        price = variant.priceInKWD

        const variantImage = typedProduct.gallery?.find((galleryItem) => {
          if (!galleryItem.variantOption) return false
          const variantOptionID =
            typeof galleryItem.variantOption === 'object'
              ? galleryItem.variantOption.id
              : galleryItem.variantOption

          return variant.options?.some((option: string | VariantOption) =>
            typeof option === 'object'
              ? option.id === variantOptionID
              : option === variantOptionID,
          )
        })

        if (variantImage && typeof variantImage.image === 'object') {
          image = variantImage.image
        }
      }

      return [
        {
          key: item.id || String(i),
          item: item as CartItem,
          product: typedProduct,
          variant,
          image,
          price,
          optionsLabel: variant ? variantOptionLabels(variant) : undefined,
        },
      ]
    })
  }, [cart])

  const totalQuantity = useMemo(() => {
    if (!cart?.items?.length) return undefined
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  const orderLink = useMemo(() => {
    const siteURL = getClientSideURL()
    const orderLines: WhatsAppOrderLine[] = lines.map((line) => ({
      title: line.product.title,
      options: line.optionsLabel,
      quantity: line.item.quantity || 1,
      unitPrice: line.price,
      url: `${siteURL}/products/${line.product.slug}`,
    }))
    return buildOrderLink(orderLines, cart?.subtotal)
  }, [lines, cart?.subtotal])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>سلة الطلب</SheetTitle>
          <SheetDescription>
            اختر المنتجات ثم أرسل الطلب عبر واتساب، ونرد عليك لتأكيد التفاصيل.
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="text-center flex flex-col items-center gap-2">
            <ShoppingCart className="h-16" />
            <p className="text-center text-2xl font-bold">السلة فارغة.</p>
          </div>
        ) : (
          <div className="grow flex px-4">
            <div className="flex flex-col justify-between w-full">
              <ul className="grow overflow-auto py-4">
                {lines.map(({ key, item, product, image, price, optionsLabel }) => (
                  <li className="flex w-full flex-col" key={key}>
                    <div className="relative flex w-full flex-row justify-between px-1 py-4">
                      <div className="absolute z-40 -mt-2 ms-[55px]">
                        <DeleteItemButton item={item} />
                      </div>
                      <Link
                        className="z-30 flex flex-row gap-4"
                        href={`/products/${product.slug}`}
                      >
                        <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                          {image?.url && (
                            <Image
                              alt={image.alt || product.title || ''}
                              className="h-full w-full object-cover"
                              height={94}
                              src={image.url}
                              width={94}
                            />
                          )}
                        </div>

                        <div className="flex flex-1 flex-col text-base">
                          <span className="leading-tight">{product.title}</span>
                          {optionsLabel ? (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {optionsLabel}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                      <div className="flex h-16 flex-col justify-between">
                        {typeof price === 'number' && (
                          <Price amount={price} className="flex justify-end text-sm" />
                        )}
                        <div className="ms-auto flex h-9 flex-row items-center rounded-lg border">
                          <EditItemQuantityButton item={item} type="minus" />
                          <p className="w-6 text-center">
                            <span className="w-full text-sm">{item.quantity}</span>
                          </p>
                          <EditItemQuantityButton item={item} type="plus" />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-4">
                <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {typeof cart?.subtotal === 'number' && (
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>المجموع</p>
                      <Price
                        amount={cart.subtotal}
                        className="text-base text-black dark:text-white"
                      />
                    </div>
                  )}

                  <a
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-3 text-base font-medium text-white hover:opacity-90"
                    href={orderLink}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    أرسل الطلب عبر واتساب
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
