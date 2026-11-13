import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { Title } from "@/components/ui/title"
import type { IdeaInsertType, IdeaSelectType, IdeaType, ListInsertType, ListType, ParticipantInsertType, ParticipantSelectType } from "api/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { LucideEllipsisVertical, LucideEuro, LucideEye, LucideEyeOff, LucideLink, LucidePencil, LucidePlus, LucideTrash, LucideX } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useAppStore } from "@/store"
import { useDialog } from "@/hooks/dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { client } from "@/api/client"
import { useQueryClient } from "react-query"
import { cn } from "@/lib/utils"
import {useFieldArray, useForm, type SubmitHandler} from 'react-hook-form'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "../ui/field"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { availableColors, IdeaForm, IdeaTeaser } from "./idea"
import { Spinner } from "../ui/spinner"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea } from "../ui/input-group"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "../ui/item"
import { Switch } from "../ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { ResponsiveDropdownMenu, ResponsiveDropdownMenuContent, ResponsiveDropdownMenuItem, ResponsiveDropdownMenuTrigger } from "../reponsive-dropdown-menu"

export function ListDetails({entity, loading}: {entity: ListType & { participant?: ParticipantSelectType }, loading: boolean}) {
    const navigate = useNavigate()
    const [ideaLoading, setIdeaLoading] = useState<null|number>(null)
    const [newIdea, setNewIdea] = useState<boolean>(false)
    const [editingIdea, setEditingIdea] = useState<number|null>(null)
    const store = useAppStore()
    const participant = useMemo(() => entity.participant, [entity.participant])
    const participationDialog = useDialog()
    const [autoBook, setAutoBook] = useState<number|undefined>(undefined)
    const queryClient = useQueryClient()
    const privacy = useMemo(() => !store.disabledListPrivacy.includes(entity?.id || ""), [store.disabledListPrivacy])
    const {dialogProps, triggerProps} = useDialog()

    const [deleteLoading, setDeleteLoading] = useState(false)
    async function handleDelete() {
        setDeleteLoading(true)
        await client.list[":id"].$delete({param: {id: entity.id}})
        setDeleteLoading(false)
        queryClient.invalidateQueries({queryKey: ['lists']})
        navigate('/')
    }

    async function submitIdeaBook(id: number) {
        if (!store.user) return

        setIdeaLoading(id)
        await client.idea[':id'].book.$post({param: {id: String(id)}})
        queryClient.invalidateQueries({queryKey: ['list', entity.id]})
    }

    function handleIdeaBook(id: number) {
        if (!participant) {
            setAutoBook(id)
            participationDialog.open()
            return
        }

        submitIdeaBook(id)
    }

    async function handleIdeaUnbook(id: number) {
        if (!store.user) return

        setIdeaLoading(id)
        await client.idea[':id'].unbook.$post({param: {id: String(id)}})
        queryClient.invalidateQueries({queryKey: ['list', entity.id]})
    }

    async function handleParticipantSelect(id: number) {
        await client.list[':id'].participate.$post({param: {id: entity.id}, json: {id}})
        queryClient.invalidateQueries({queryKey: ['list', entity.id]})
        participationDialog.close()
    } 

    async function handleIdeaAdd(idea: IdeaInsertType) {
        if (!store.user) return

        await client.list[':id'].idea.$post({param: {id: entity.id}, json: {color: pickValue(availableColors), ...idea, }})
        await queryClient.invalidateQueries({queryKey: ['list', entity.id]})
        setNewIdea(false)
    }

    async function handleIdeaEdit(idea: IdeaType) {
        if (!store.user) return

        await client.list[":list"].idea[":idea"].$post({param: {list: entity.id, idea: String(idea.id)}, json: idea})
        await queryClient.invalidateQueries({queryKey: ['list', entity.id]})
        setEditingIdea(null)
    }

    async function handleIdeaDelete(id: IdeaSelectType['id']) {
        setIdeaLoading(id)
        await client.list[":list"].idea[":idea"].$delete({param: {list: entity.id, idea: String(id)}})
        await queryClient.invalidateQueries({queryKey: ['list', entity.id]})
        setIdeaLoading(null)
    }

    useEffect(() => {
        if (autoBook && participant) {
            submitIdeaBook(autoBook)
            setAutoBook(undefined)
        }
    }, [autoBook, participant])

    useEffect(() => {
        if (!loading && ideaLoading !== null) {
            setIdeaLoading(null)
        }
    }, [loading])

    return <div className="space-y-6">
        <div className="flex gap-2 items-center">
            <Title variant={"h1"} className="mr-2">{entity.name} {loading}</Title>
            {store.user?.id === entity.authorId && <>
                <ResponsiveDropdownMenu>
                    <ResponsiveDropdownMenuTrigger render={<Button size="icon-sm" variant="outline"/>} >
                        <LucideEllipsisVertical/>
                    </ResponsiveDropdownMenuTrigger>
                    <ResponsiveDropdownMenuContent>
                        {privacy && <ResponsiveDropdownMenuItem onClick={() => store.saveDisabledPrivacy(entity.id)}><LucideEye/>Voir les participations</ResponsiveDropdownMenuItem>}
                        {!privacy && <ResponsiveDropdownMenuItem onClick={() => store.resetPrivacy(entity.id)}><LucideEyeOff/>Cacher les participations</ResponsiveDropdownMenuItem>}
                        <ResponsiveDropdownMenuItem render={<Link to={`/list/${entity.id}/edit`}/>}><LucidePencil/>Modifier</ResponsiveDropdownMenuItem>
                        <ResponsiveDropdownMenuItem variant="destructive" {...triggerProps}>
                            <LucideTrash/>Supprimer
                        </ResponsiveDropdownMenuItem>
                    </ResponsiveDropdownMenuContent>
                </ResponsiveDropdownMenu>
                <Dialog {...dialogProps}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Supprimer {entity.name}</DialogTitle>
                            <DialogDescription>Attention, cette action est irréversible</DialogDescription>
                        </DialogHeader>
                        <p>Vous êtes sur le point de supprimer une liste qui possède {entity.ideas.length} idée(s) et {entity.participants.length} participant(s). En êtes-vous sûr ?</p>
                        <DialogFooter>
                            <DialogClose render={<Button variant='ghost'/>}>Annuler</DialogClose>
                            <Button variant={"destructive"} onClick={handleDelete} disabled={deleteLoading}>{deleteLoading && <Spinner/>}Supprimer la liste</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>}
        </div>
        <div className="relative">
            <div className={cn("space-y-6 transition-all", entity.authorId === store.user?.id && privacy && "blur-xl")}>
                <div className="flex items-center gap-2">
                    {participant && <p className="text-muted-foreground text-sm">Vous participez à cette liste en tant que {participant.name}.</p>}
                    {!participant && <p className="text-muted-foreground text-sm">Vous ne participez pas encore à cette liste.</p>}
                    <Button variant={"outline"} size="sm" {...participationDialog.triggerProps}>{participant ? "Changer" : "Participer"}</Button>
                </div>
                <div className='grid [--size:20ch] grid-cols-[repeat(auto-fill,minmax(var(--size),1fr))] gap-4'>
                    {entity.ideas.map(idea => editingIdea === idea.id ? 
                        <IdeaForm 
                            key={`idea-${idea.id}-edit`}
                            entity={idea} 
                            onSubmit={(values) => handleIdeaEdit(values)} 
                            onCancel={() => setEditingIdea(null)}
                        /> :
                        <IdeaTeaser 
                            key={`idea-${idea.id}-teaser`}
                            entity={idea}
                            participant={participant}
                            onEdit={() => setEditingIdea(idea.id)}
                            onDelete={() => handleIdeaDelete(idea.id)}
                            onBook={() => handleIdeaBook(idea.id)}
                            onUnbook={() => handleIdeaUnbook(idea.id)}
                        />
                    )}
                    {entity.allowIdeaProposal && !newIdea && participant && <Card className={cn("border-2 border-dashed p-0 min-h-[15ch]")}>
                        <Button variant={"ghost"} className="h-auto size-full rounded-[inherit]" onClick={() => setNewIdea(true)}><LucidePlus/>Ajouter une idée</Button>
                    </Card>}
                    {entity.allowIdeaProposal && newIdea && <IdeaForm onSubmit={handleIdeaAdd} onCancel={() => setNewIdea(false)}/>}
                </div>
            </div>
            <div className={cn("absolute size-full inset-0 flex items-center justify-center transition-all opacity-0 pointer-events-none", entity.authorId === store.user?.id && privacy && "opacity-100 pointer-events-auto")}>
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Attention!</CardTitle>
                        <CardDescription>Vous êtes sur le point d'accéder à une de vos liste.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">Vous risquez de voir les participations de chacuns. Mieux vaut garder la surprise si cette liste vous concerne!</CardContent>
                    <CardFooter className="grid gap-2">
                        <Button onClick={() => store.saveDisabledPrivacy(entity.id)} variant={"outline"}>Afficher quand même la liste</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
        <Dialog {...participationDialog.dialogProps}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Qui es-tu ?</DialogTitle>
                    <DialogDescription>Trouve ton nom dans la liste ci-dessous</DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 flex-wrap">{entity.participants.map(({id, name}) => <Button key={id} variant={participant?.id === id ? "default" : "outline"} onClick={() => handleParticipantSelect(id)}>{name}</Button>)}</div>
            </DialogContent>
        </Dialog>
    </div>
}

export function ListTeaser({entity}: {entity: ListType}) {
    const queryClient = useQueryClient()
    const {user} = useAppStore()
    const [loading, setLoading] = useState(false)
    const {triggerProps, dialogProps} = useDialog()

    async function handleDelete() {
        setLoading(true)
        await client.list[":id"].$delete({param: {id: entity.id}})
        setLoading(false)
        queryClient.invalidateQueries({queryKey: ['lists']})
    }

    return <Item variant={"outline"} className="relative transition-colors hover:bg-muted">
        <ItemContent>
            <ItemTitle>{entity.name}</ItemTitle>
            <ItemDescription>
                <span className="block">{entity.participants.length} participants</span>
                <span className="block">{entity.ideas.length} idées</span>
            </ItemDescription>
        </ItemContent>
        {user?.id === entity.authorId && <ItemActions className="self-start relative z-1">
            <ResponsiveDropdownMenu>
                <ResponsiveDropdownMenuTrigger render={<Button size="icon-sm" variant="outline"/>} >
                    <LucideEllipsisVertical/>
                </ResponsiveDropdownMenuTrigger>
                <ResponsiveDropdownMenuContent>
                    <ResponsiveDropdownMenuItem render={<Link to={`/list/${entity.id}/edit`}/>}><LucidePencil/>Modifier</ResponsiveDropdownMenuItem>
                    <ResponsiveDropdownMenuItem variant="destructive" {...triggerProps}>
                        <LucideTrash/>Supprimer
                    </ResponsiveDropdownMenuItem>
                </ResponsiveDropdownMenuContent>
            </ResponsiveDropdownMenu>
            <Dialog {...dialogProps}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer {entity.name}</DialogTitle>
                        <DialogDescription>Attention, cette action est irréversible</DialogDescription>
                    </DialogHeader>
                    <p>Vous êtes sur le point de supprimer une liste qui possède {entity.ideas.length} idée(s) et {entity.participants.length} participant(s). En êtes-vous sûr ?</p>
                    <DialogFooter>
                        <DialogClose render={<Button variant='ghost'/>}>Annuler</DialogClose>
                        <Button variant={"destructive"} onClick={handleDelete} disabled={loading}>{loading && <Spinner/>}Supprimer la liste</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ItemActions>}
        <Link to={`/list/${entity.id}`} className="absolute inset-0"/>
    </Item>
}

type ListEditionType = ListInsertType & {ideas: IdeaInsertType[], participants: ParticipantInsertType[]}

const exampleIdeas = [
    'Un skateboard',
    'Des chaussettes',
    'Un bonnet',
    'Le dernier CD de shakira',
    'La BD des Schtroumpf tome 4',
    'Un nouveau manteau',
    'Du thé',
    'Un bijou',
    'Un mug personnalisé',
    'Un panier de basket',
    'Une Lamborghini'
]

const exampleProviders = [
    'Papa',
    'Maman',
    'Tonton',
    'Tata',
    'Michel',
    'Jacque',
    'Mamie',
    'Corentin',
    'Le voisin'
]

function pickValue(array: string[]) {
    return array[Math.floor(Math.random()*(array.length-1))]
}

export function ListForm({entity}: {entity?: ListEditionType}) {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const {user, disabledListPrivacy, resetPrivacy, saveDisabledPrivacy} = useAppStore()
    const privacy = useMemo(() => !disabledListPrivacy.includes(entity?.id || ""), [disabledListPrivacy])
    const [values, setValues] = useState<ListEditionType|null>(entity ?? null)
    if (!user) return

    const {
        register,
        handleSubmit,
        control,
        getValues,
        subscribe,
        setValue
    } = useForm<ListEditionType>({defaultValues: entity ?? { 
        allowIdeaProposal: true,
        name: `Ma super liste de noël ${(new Date()).getFullYear()}`
     }})
    const ideas = useFieldArray({name: 'ideas', control})
    const participants = useFieldArray({name: 'participants', control})

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

    // You can also just return the subscribe
    // return subscribe({ callback: ({ values }) => console.log(values) });
  }, [subscribe])

    const onSubmit: SubmitHandler<ListEditionType> = async (data) => {
        setLoading(true)
        const listData = {
            ...data,
            participants: data.participants,
            ideas: data.ideas.map(idea => ({...idea, color: idea.color ?? pickValue(availableColors)}))
        }
        if (entity) {
            const {id} = entity
            if(!id) return 

            const response = await client.list[':id'].$post({param: {id}, json: listData})
    
            if (response.ok) {
                const list = await response.json()
                navigate(`/list/${list.id}`)
            }
        } else {
            const response = await client.list.$post({json: listData})
    
            if (response.ok) {
                const list = await response.json()
                navigate(`/list/${list.id}`)
            }
        }

        setLoading(false)
    }

    const formActions = <>
        <Button variant={"ghost"} render={<Link to='/'/>} nativeButton={false}>Annuler</Button>
        <Button type="submit" disabled={loading}>{loading && <Spinner/>}{entity ? "Enregistrer la liste" : "Créer la liste"}</Button>
    </>

    return <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-[30ch_1fr] gap-6">
        <FieldSet>
            <FieldLegend>Paramètres de la liste</FieldLegend>
            <FieldDescription>Fournissez les informations nécessaires au bon fonctionnement de votre liste.</FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Nom de la liste</FieldLabel>
                    <Input defaultValue={"Ma super liste de noël 2025"} id="name" {...register("name")} />
                </Field>
            </FieldGroup>
            <FieldGroup>
                <Field>
                    <FieldLabel>Participants</FieldLabel>
                    <div className="grid gap-2">
                        {participants.fields.map((field, index) => <InputGroup key={field.id}>
                            <InputGroupInput {...register(`participants.${index}.name`)}/>
                            <InputGroupAddon align="inline-end">
                                <Tooltip>
                                    <TooltipTrigger render={ <InputGroupButton type="button" variant={"ghost"}/>} onClick={() => participants.remove(index)}>
                                        <LucideX/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Retirer le participant
                                    </TooltipContent>
                                </Tooltip>
                            </InputGroupAddon>
                        </InputGroup>)}
                    </div>
                    <Button type="button" variant={"outline"} className="border-2 border-dashed" onClick={() => participants.append({name: pickValue(exampleProviders)})}><LucidePlus/>Ajouter un participant</Button>
                </Field>
                <FieldLabel htmlFor="allowIdeaProposal">
                    <Field orientation={"horizontal"}>
                        <FieldContent >
                            <FieldTitle>
                                Accepter les propositions d'idées
                            </FieldTitle>
                            <FieldDescription>Les participants pourront ajouter des idées à cette liste</FieldDescription>
                        </FieldContent>
                        <Switch id="allowIdeaProposal" {...register("allowIdeaProposal")} checked={values?.allowIdeaProposal ?? true} onCheckedChange={(value) => setValue("allowIdeaProposal", value)}/>
                    </Field>
                </FieldLabel>
            </FieldGroup>
            <Separator/>
            <div className="hidden md:grid gap-4">
                {formActions}
            </div>
        </FieldSet>
        <FieldSet>
            <FieldLegend className="flex items-center gap-2">
                Trouvez des idées originales
            </FieldLegend>
            <FieldDescription>Chaque participant pourra ensuite choisir la ou les idées qui l'intéressent.</FieldDescription>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(20ch,1fr))] gap-4">
                {ideas.fields.map((field, index) => <InputGroup key={field.id} className={cn("w-full transition-all md:min-h-[15ch]", field.authorId && privacy && "blur-md pointer-events-none")}>
                    <InputGroupTextarea  {...register(`ideas.${index}.name`)} placeholder={`Idée n°${index+1}`}/>
                    <InputGroupAddon align={"block-start"} className="self-start w-full">
                        <span className="flex-1">Idée n°{index+1}</span>
                        <Tooltip>
                            <TooltipTrigger render={ <InputGroupButton type="button" variant={"ghost"}/>} onClick={() => ideas.remove(index)}>
                                <LucideX/>
                            </TooltipTrigger>
                            <TooltipContent>
                                Retirer l'idée
                            </TooltipContent>
                        </Tooltip>
                    </InputGroupAddon>
                    <InputGroupAddon align={"block-end"} className="grid justify-stretch">
                        {field.price == null && <Button variant="ghost" onClick={() => ideas.update(index, {...getValues(`ideas.${index}`), price: "1"})}><LucidePlus/>Ajouter un prix</Button>}
                        {field.price !== null && <InputGroup>
                            <InputGroupAddon align={"inline-start"}><LucideEuro/></InputGroupAddon>
                            <InputGroupInput type="number" step="0.01" {...register(`ideas.${index}.price`)}/>
                            <InputGroupAddon align={"inline-end"}>
                                <Tooltip>
                                    <TooltipTrigger render={ <InputGroupButton type="button" variant={"ghost"}/>} onClick={() => ideas.update(index, {...getValues(`ideas.${index}`), price: null})}>
                                        <LucideX/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Retirer le prix
                                    </TooltipContent>
                                </Tooltip>
                            </InputGroupAddon>
                        </InputGroup>}
                        {field.link == null && <Button variant="ghost" onClick={() => ideas.update(index, {...getValues(`ideas.${index}`), link: ""})}><LucidePlus/>Ajouter un lien</Button>}
                        {field.link !== null && <InputGroup>
                            <InputGroupAddon align={"inline-start"}><LucideLink/></InputGroupAddon>
                            <InputGroupInput {...register(`ideas.${index}.link`)}/>
                            <InputGroupAddon align={"inline-end"}>
                                <Tooltip>
                                    <TooltipTrigger render={ <InputGroupButton type="button" variant={"ghost"}/>} onClick={() => ideas.update(index, {...getValues(`ideas.${index}`), link: null})}>
                                        <LucideX/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Retirer le lien
                                    </TooltipContent>
                                </Tooltip>
                            </InputGroupAddon>
                        </InputGroup>}
                    </InputGroupAddon>
                </InputGroup>)}
                <Button type="button" variant={"outline"} className="border-2 border-dashed w-full h-auto min-h-[15ch]" onClick={() => ideas.append({name: pickValue(exampleIdeas), link: null, price: null})}><LucidePlus/>Ajouter une idée</Button>
            </div>
            {values && values.allowIdeaProposal && <div>
                {entity && privacy && <Button variant={"link"} className="h-auto whitespace-break-spaces text-left gap-3 md:gap-2" onClick={() => saveDisabledPrivacy(entity.id??"")}><LucideEye/>Afficher les idées proposées par les participants</Button>}
                {entity && !privacy && <Button variant={"link"} className="h-auto whitespace-break-spaces text-left gap-3 md:gap-2" onClick={() => resetPrivacy(entity.id??"")}><LucideEyeOff/>Cacher les idées proposées par les participants</Button>}
            </div>}
        </FieldSet>
        <div className="md:hidden grid gap-4">
            {formActions}
        </div>
    </form>
}