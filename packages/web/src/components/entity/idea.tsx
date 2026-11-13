import { useForm, type SubmitHandler } from "react-hook-form"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { Textarea } from "../ui/textarea"
import type { IdeaInsertType, IdeaSelectType, IdeaType, ParticipantSelectType } from "api/types"
import { Button } from "../ui/button"
import { LucideCheckCircle2, LucideEllipsisVertical, LucideEuro, LucideExternalLink, LucideLink, LucidePen, LucidePlus, LucidePlusCircle, LucideTrash, LucideX } from "lucide-react"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea } from "../ui/input-group"
import { cn } from "cn"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { ResponsiveDropdownMenu, ResponsiveDropdownMenuContent, ResponsiveDropdownMenuItem, ResponsiveDropdownMenuTrigger } from "../reponsive-dropdown-menu"
import { useDialog } from "@/hooks/dialog"

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

function participantsString(participants: ParticipantSelectType[]) {
    const participantsName = participants.map(p => p.name)

    if (participantsName.length == 0) return ""
    if (participantsName.length == 1) return `${participantsName[0]} s'en occupe`
    
    const lastParticipant = participantsName[participantsName.length-1]
    const otherParticipants = participantsName.slice(0, -1)
    return `${otherParticipants.join(', ')} et ${lastParticipant} s'en occupent`
}

export function IdeaForm({entity, onSubmit, onCancel, ...props}: {entity?: IdeaSelectType, onSubmit: SubmitHandler<IdeaType>, onCancel?: () => void}) {
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


    return <form onSubmit={handleSubmit(submitHandler)} {...props}>
        <InputGroup className={cn("w-full md:min-h-[15ch]")}>
            <InputGroupAddon align={"block-start"}>Nom de l'idée</InputGroupAddon>
            <InputGroupTextarea  {...register('name')}/>
            <InputGroupAddon align={"block-end"} className="grid w-full justify-stretch">
                {values.price === null && <Button variant="ghost" onClick={() => setValue('price', '1')}><LucidePlus/>Ajouter un prix</Button>}
                {values.price !== null && <InputGroup>
                    <InputGroupAddon align={"inline-start"}><LucideEuro/></InputGroupAddon>
                    <InputGroupInput {...register("price")}/>
                    <InputGroupAddon align={"inline-end"}>
                        <Tooltip>
                            <TooltipTrigger render={ <InputGroupButton type="button" variant={"ghost"}/>} onClick={() => setValue('price', null)}>
                                <LucideX/>
                            </TooltipTrigger>
                            <TooltipContent>
                                Retirer le lien
                            </TooltipContent>
                        </Tooltip>
                    </InputGroupAddon>
                </InputGroup>}
                {values.link === null && <Button variant="ghost" onClick={() => setValue('link', '')}><LucidePlus/>Ajouter un lien</Button>}
                {values.link !== null && <InputGroup>
                    <InputGroupAddon align={"inline-start"}><LucideLink/></InputGroupAddon>
                    <InputGroupInput {...register("link")}/>
                    <InputGroupAddon align={"inline-end"}>
                        <Tooltip>
                            <TooltipTrigger render={ <InputGroupButton type="button" variant={"ghost"}/>} onClick={() => setValue('link', null)}>
                                <LucideX/>
                            </TooltipTrigger>
                            <TooltipContent>
                                Retirer le lien
                            </TooltipContent>
                        </Tooltip>
                    </InputGroupAddon>
                </InputGroup>}
                <div className="flex gap-2 *:flex-1">
                    <Button type="button" variant={"outline"} onClick={() => onCancel && onCancel()}>Annuler</Button>
                    <Button type="submit" disabled={loading}>{loading && <Spinner/>}{entity?.id ? "Modifier": "Ajouter"}</Button>
                </div>
            </InputGroupAddon>
        </InputGroup>
    </form>
}

export function IdeaTeaser({entity, loading, participant, onEdit, onDelete, onBook, onUnbook, ...props}: {entity: IdeaType, loading?: boolean, participant?: ParticipantSelectType, onEdit?: () => void, onDelete?: () => void, onBook: () => void, onUnbook: () => void}) {
    const {triggerProps, dialogProps} = useDialog()

    return <Card className={cn("p-0 gap-4 group", entity.participants.length > 0 && "ring-primary", (entity.color && entity.color in backgroundColorMapping) ? backgroundColorMapping[entity.color] : backgroundColorMapping.default)} {...props}>
        <div className="p-4 w-full h-full grid md:grid-rows-[1fr_auto_1fr] gap-4">
            <div className="relative flex justify-center">
                {entity.authorId && <>
                    <ResponsiveDropdownMenu>
                        <ResponsiveDropdownMenuTrigger render={<Button variant={"outline"} size="xs" className="truncate" disabled={entity.authorId !== participant?.id}/>}>
                            Idée de {entity.author.name} {onEdit && <LucideEllipsisVertical/>}
                        </ResponsiveDropdownMenuTrigger>
                        {onEdit && <ResponsiveDropdownMenuContent>
                            <ResponsiveDropdownMenuItem onClick={onEdit}><LucidePen/>Modifier</ResponsiveDropdownMenuItem>
                            <ResponsiveDropdownMenuItem variant="destructive" {...triggerProps}>
                                <LucideTrash/> Supprimer
                            </ResponsiveDropdownMenuItem>
                        </ResponsiveDropdownMenuContent>}
                    </ResponsiveDropdownMenu>
                    {onEdit && <Dialog {...dialogProps}>
                        <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Supprimer l'idée</DialogTitle>
                            <DialogDescription>Vous êtes sur le point de supprimer cette idée</DialogDescription>
                        </DialogHeader>
                        <p className="text-sm">En êtes-vous sûr ? </p>
                        <DialogFooter>
                            <DialogClose render={<Button variant={"ghost"}/>}>
                                Annuler
                            </DialogClose>
                            <Button variant={"destructive"} onClick={onDelete}>Supprimer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>}
                </>}
            </div>
                
            <CardHeader className="p-0 flex-1 flex flex-col items-center justify-center gap-1 text-center md:min-h-[5em]">
                <CardTitle>
                    {entity.name}
                </CardTitle>
                {entity.price && <CardDescription>{Intl.NumberFormat("fr-FR", { style: 'currency', currency: 'EUR' }).format(Number(entity.price))}</CardDescription>}
                {entity.link && <Button variant={"link"} render={<a href={entity.link} target="_blank"/>} nativeButton={false}><LucideExternalLink/>Voir l'idée</Button>}
            </CardHeader>
            <CardFooter className="p-0 relative grid gap-2">
                <Button tabIndex={-1} className="hidden md:block opacity-0 pointer-events-none"/>
                <div className="md:absolute md:left-0 md:bottom-0 w-full transition-all md:group-hover:opacity-0 md:group-hover:-translate-y-2">
                    {entity.participants.length > 0 && <p className="text-sm text-center"><LucideCheckCircle2 className="inline size-[1em]"/> {participantsString(entity.participants)}</p>}
                </div>
                <div className="md:absolute md:left-0 md:bottom-0 w-full flex gap-2 md:opacity-0 transition-all md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                    {entity.participants.length === 0 && <Button variant="outline" className={cn("flex-1")} disabled={loading} onClick={onBook}>{loading && <Spinner/>}Je le prends</Button>}
                    {entity.participants.length > 0 && !entity.participants.map(p => p.id).includes(participant?.id ?? -1) && <Button variant="outline" className="flex-1" disabled={loading} onClick={onBook}>{loading && <Spinner/>}Je participe</Button>}
                    {participant && entity.participants.map(p =>p.id).includes(participant.id) && <Button className="flex-1 bg-transparent" variant={"outline"} disabled={loading} onClick={onUnbook}>{loading && <Spinner/>}Annuler</Button>}
                </div>
            </CardFooter>
            </div>
        </Card>
}