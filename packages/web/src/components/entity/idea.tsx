import { useForm, type SubmitHandler } from "react-hook-form"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { Textarea } from "../ui/textarea"
import type { IdeaInsertType, IdeaSelectType, IdeaType } from "api/types"
import { Button } from "../ui/button"
import { LucideLink, LucidePlus, LucidePlusCircle, LucideX } from "lucide-react"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea } from "../ui/input-group"
import { cn } from "cn"
import { Dialog } from "../ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export const availableColors = [
    'red',
    'orange',
    'amber',
    'green',
    'lime',
    'emerald',
    'yellow',
    'blue',
    'violet',
    'cyan',
    'indigo',
    'purple',
    'fuchsia',
    'pink',
    'default'
]

export const backgroundColorMapping: Record<typeof availableColors[number], string> = {
    red: 'bg-linear-to-tr from-red-600/20 dark:from-red-400/20 to-transparent',
    orange: 'bg-linear-to-tr from-orange-600/20 dark:from-orange-400/20 to-transparent',
    amber: 'bg-linear-to-tr from-amber-600/20 dark:from-amber-400/20 to-transparent',
    green: 'bg-linear-to-tr from-green-600/20 dark:from-green-400/20 to-transparent',
    lime: 'bg-linear-to-tr from-lime-600/20 dark:from-lime-400/20 to-transparent',
    emerald: 'bg-linear-to-tr from-emerald-600/20 dark:from-emerald-400/20 to-transparent',
    yellow: 'bg-linear-to-tr from-yellow-600/20 dark:from-yellow-400/20 to-transparent',
    blue: 'bg-linear-to-tr from-blue-600/20 dark:from-blue-400/20 to-transparent',
    violet: 'bg-linear-to-tr from-violet-600/20 dark:from-violet-400/20 to-transparent',
    cyan: 'bg-linear-to-tr from-cyan-600/20 dark:from-cyan-400/20 to-transparent',
    indigo: 'bg-linear-to-tr from-indigo-600/20 dark:from-indigo-400/20 to-transparent',
    purple: 'bg-linear-to-tr from-purple-600/20 dark:from-purple-400/20 to-transparent',
    fuchsia: 'bg-linear-to-tr from-fuchsia-600/20 dark:from-fuchsia-400/20 to-transparent',
    pink: 'bg-linear-to-tr from-pink-600/20 dark:from-pink-400/20 to-transparent',
    default: 'bg-linear-to-tr from-black/20 dark:from-white/20 to-transparent'
}

export const backgroundColorInputMapping: Record<typeof availableColors[number], string> = {
    red: 'bg-red-600 dark:bg-red-400',
    orange: 'bg-orange-600 dark:bg-orange-400',
    amber: 'bg-amber-600 dark:bg-amber-400',
    green: 'bg-green-600 dark:bg-green-400',
    lime: 'bg-lime-600 dark:bg-lime-400',
    emerald: 'bg-emerald-600 dark:bg-emerald-400',
    yellow: 'bg-yellow-600 dark:bg-yellow-400',
    blue: 'bg-blue-600 dark:bg-blue-400',
    violet: 'bg-violet-600 dark:bg-violet-400',
    cyan: 'bg-cyan-600 dark:bg-cyan-400',
    indigo: 'bg-indigo-600 dark:bg-indigo-400',
    purple: 'bg-purple-600 dark:bg-purple-400',
    fuchsia: 'bg-fuchsia-600 dark:bg-fuchsia-400',
    pink: 'bg-pink-600 dark:bg-pink-400',
}

export function IdeaForm({entity, onSubmit, onCancel}: {entity?: IdeaSelectType, onSubmit: SubmitHandler<IdeaType>, onCancel?: () => void}) {
    const [values, setValues] = useState<Partial<IdeaType>>(entity ?? { name: "", link: null })
    const [loading, setLoading] = useState(false)

    const {
        register,
        setValue,
        subscribe,
        handleSubmit
    } = useForm<IdeaType>({defaultValues: entity ?? { name: "", link: null }})

    useEffect(() => {
        // make sure to unsubscribe;
        const unsubscribe = subscribe({
        formState: {
            values: true,
        },
        callback: ({ values }) => {
            setValues(values)
        },
        })

        return () => unsubscribe()
    }, [subscribe])

    async function submitHandler(...args: Parameters<typeof onSubmit>) {
        setLoading(true)
        await onSubmit(...args)
        setLoading(false)
    }


    return <form onSubmit={handleSubmit(submitHandler)}>
        <InputGroup className={cn("w-full md:min-h-[15ch]")}>
            <InputGroupAddon align={"block-start"}>Nom de l'idée</InputGroupAddon>
            <InputGroupTextarea  {...register('name')}/>
            <InputGroupAddon align={"block-end"} className="grid w-full justify-stretch">
                {values.link !== null && <InputGroup>
                    <InputGroupAddon align={"inline-start"}><LucideLink/></InputGroupAddon>
                    <InputGroupInput {...register("link")}/>
                    <InputGroupAddon align={"inline-end"}>
                        <Tooltip>
                            <TooltipTrigger render={ <InputGroupButton type="button" variant={"ghost"}/>} onClick={() => setValue('link', null)}>
                                <LucideX/>
                            </TooltipTrigger>
                            <TooltipContent>
                                Supprimer le lien
                            </TooltipContent>
                        </Tooltip>
                    </InputGroupAddon>
                </InputGroup>}
                {values.link === null && <Button variant="ghost" onClick={() => setValue('link', '')}><LucidePlus/>Ajouter un lien</Button>}
                <Button type="button" variant={"outline"} onClick={() => onCancel && onCancel()}>Annuler</Button>
                <Button type="submit" disabled={loading}>{loading && <Spinner/>}{entity?.id ? "Modifier l'idée": "Ajouter l'idée"}</Button>
            </InputGroupAddon>
        </InputGroup>
    </form>
}