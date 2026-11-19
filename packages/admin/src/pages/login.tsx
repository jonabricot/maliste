import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { authClient } from "@/api/auth-client"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/auth"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const { handleSubmit, register } = useForm()
    const {user} = useAuth()
    const navigate = useNavigate()

    async function onSubmit(data) {
        await authClient.signIn.email(data)
        navigate('/dashboard/users')
    }

    async function onChangeAccount() {
        await authClient.signOut()
    }

    if (user) {
        return <>
            <Item variant="outline" render={<Link to={"/dashboard"}/>}>
                <ItemContent>
                    <ItemTitle>Continuer en tant que {user.name}</ItemTitle>
                </ItemContent>
            </Item>
            <Button onClick={onChangeAccount}>Utiliser un autre compte</Button>
        </>
    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
            
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register('email')}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" required {...register('password')} />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
