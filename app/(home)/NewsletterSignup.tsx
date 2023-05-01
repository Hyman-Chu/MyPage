'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { clsxm } from '@zolplay/utils'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { useForm } from 'react-hook-form'
import { TbMailbox } from 'react-icons/tb'
import { useReward } from 'react-rewards'
import { z } from 'zod'

import { Button } from '~/components/ui/Button'

const formId = '5108903'

export const newsletterFormSchema = z.object({
  email: z.string().email({ message: '邮箱地址不正确' }).nonempty(),
  formId: z.string().nonempty(),
})
export type NewsletterForm = z.infer<typeof newsletterFormSchema>

export function NewsletterSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterForm>({
    defaultValues: { formId },
    resolver: zodResolver(newsletterFormSchema),
  })
  const [isSubscribed, setIsSubscribed] = React.useState(false)
  const { reward } = useReward('newsletter-rewards', 'emoji', {
    position: 'absolute',
    emoji: ['🤓', '😊', '🥳', '🤩', '🤪', '🤯', '🥰', '😎', '🤑', '🤗', '😇'],
    elementCount: 32,
  })
  const onSubmit = React.useCallback(
    async (data: NewsletterForm) => {
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
          body: JSON.stringify({ data }),
        })
        if (response.ok) {
          reset()
          reward()
          setIsSubscribed(true)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [reward, reset]
  )

  React.useEffect(() => {
    if (isSubscribed) {
      setTimeout(() => setIsSubscribed(false), 6000)
    }
  }, [isSubscribed])

  return (
    <form
      className={clsxm(
        'relative rounded-2xl border border-zinc-100 p-6 transition-opacity dark:border-zinc-700/40',
        isSubmitting && 'pointer-events-none opacity-70'
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      <input type="hidden" className="hidden" {...register('formId')} />
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <TbMailbox className="h-6 w-6 flex-none" />
        <span className="ml-3">动态更新</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        获取我最新发布的内容通知，随时可以取消订阅。
      </p>
      <AnimatePresence mode="wait">
        {!isSubscribed ? (
          <motion.div
            className="mt-6 flex"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit="initial"
          >
            <input
              type="email"
              placeholder="电子邮箱"
              aria-label="电子邮箱"
              required
              className="min-w-0 flex-auto appearance-none rounded-lg border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] placeholder:text-zinc-400 focus:border-lime-500 focus:outline-none focus:ring-4 focus:ring-lime-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-lime-400/50 dark:focus:ring-lime-400/5 sm:text-sm"
              {...register('email')}
            />
            <Button type="submit" className="ml-2 flex-none">
              订阅
            </Button>
          </motion.div>
        ) : (
          <motion.p
            className="mt-6 text-center text-lg text-zinc-700 dark:text-zinc-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit="initial"
          >
            🎉 感谢你的订阅 🥳
          </motion.p>
        )}
      </AnimatePresence>
      <span id="newsletter-rewards" className="relative h-0 w-0" />
      {errors.email && (
        <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
          {errors.email.message}
        </p>
      )}
    </form>
  )
}
