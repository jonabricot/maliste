import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { Title } from "@/components/ui/title"
import type { IdeaInsertType, IdeaSelectType, IdeaType, ListInsertType, ListType, ParticipantInsertType, ParticipantSelectType } from "api/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { LucideCheckCircle2, LucideCircleQuestionMark, LucideEllipsisVertical, LucideExternalLink, LucideEye, LucideEyeOff, LucideLink, LucidePen, LucidePlus, LucidePlusCircle, LucideTrash, LucideX } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useAppStore } from "@/store"
import { useDialog } from "@/hooks/dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { client } from "@/api/client"
import { useQueryClient } from "react-query"
import { cn } from "@/lib/utils"
import {useFieldArray, useForm, type SubmitHandler} from 'react-hook-form'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"
import { availableColors, backgroundColorMapping, IdeaForm } from "./idea"
import { Spinner } from "../ui/spinner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "../ui/input-group"
import { Item, ItemContent, ItemDescription, ItemTitle } from "../ui/item"
import { Switch } from "../ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { TooltipViewportCssVariables } from "@base-ui/react"
import { ButtonGroup } from "../ui/button-group"

function participantsString(participants: ParticipantSelectType[]) {
    const participantsName = participants.map(p => p.name)

    if (participantsName.length == 0) return ""
    if (participantsName.length == 1) return `${participantsName[0]} s'en occupe`
    
    const lastParticipant = participantsName[participantsName.length-1]
    const otherParticipants = participantsName.slice(0, -1)
    return `${otherParticipants.join(', ')} et ${lastParticipant} s'en occupent`
}

export function ListDetails({entity, loading}: {entity: ListType & { participant?: ParticipantSelectType }, loading: boolean}) {
    const [ideaLoading, setIdeaLoading] = useState<null|number>(null)
    const [newIdea, setNewIdea] = useState<boolean>(false)
    const [editingIdea, setEditingIdea] = useState<number|null>(null)
    const store = useAppStore()
    const participant = useMemo(() => entity.participant, [entity.participant])
    const participationDialog = useDialog()
    const [autoBook, setAutoBook] = useState<number|undefined>(undefined)
    const queryClient = useQueryClient()
    const [privacy, setPrivacy] = useState(!store.disabledListPrivacy.includes(entity.id))

    function handleResetPrivacy() {
        setPrivacy(true)
        store.resetPrivacy(entity.id)
    }

    function handleSavingDisabledPrivacy() {
        setPrivacy(false)
        store.saveDisabledPrivacy(entity.id)
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
        <div className="grid md:flex gap-2 items-center">
            <Title variant={"h1"} className="mr-2">{entity.name} {loading}</Title>
            {entity.authorId === store.user?.id && <Button render={<Link to={`/list/${entity.id}/edit`}/>}><LucidePen/>Modifier la liste</Button>}
            {entity.authorId === store.user?.id && privacy && <Button variant={"outline"} onClick={() => setPrivacy(false)}><LucideEye/>Voir la liste</Button>}
            {entity.authorId === store.user?.id && !privacy && <Button variant={"outline"} onClick={handleResetPrivacy}><LucideEyeOff/>Cacher la liste</Button>}
        </div>
        <div className="relative">
            <div className={cn("space-y-6 transition-all", entity.authorId === store.user?.id && privacy && "blur-xl")}>
                <div className="flex items-center gap-2">
                    {participant && <p className="text-muted-foreground text-sm">Vous participez à cette liste en tant que {participant.name}.</p>}
                    {!participant && <p className="text-muted-foreground text-sm">Vous ne participez pas encore à cette liste.</p>}
                    <Button variant={"outline"} size="sm" {...participationDialog.triggerProps}>{participant ? "Changer" : "Participer"}</Button>
                </div>
                <div className='grid [--size:15ch] md:[--size:20ch] grid-cols-[repeat(auto-fill,minmax(var(--size),1fr))] gap-4'>
                    {entity.ideas.map(idea => <Card key={`idea-${idea.id}`} className={cn("p-0 gap-4 group", idea.participants.length > 0 && "ring-primary", (idea.color && idea.color in backgroundColorMapping) ? backgroundColorMapping[idea.color] : backgroundColorMapping.default)}>
                        {editingIdea === idea.id && <IdeaForm entity={idea} onSubmit={(values) => handleIdeaEdit(values)} onCancel={() => setEditingIdea(null)}/>}
                        {editingIdea !== idea.id && <div className="p-4 w-full h-full grid grid-rows-[1fr_auto_1fr] gap-4">
                            <div className="relative flex justify-center">
                                {idea.authorId && <Dialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger render={<Button variant={"outline"} size="xs" className="truncate" disabled={idea.authorId !== participant?.id}/>}>
                                            Idée de {idea.author.name} {idea.authorId === participant?.id && <LucideEllipsisVertical/>}
                                        </DropdownMenuTrigger>
                                        {idea.authorId === participant?.id && <DropdownMenuContent align="start" side="right">
                                            <DropdownMenuItem onClick={() => setEditingIdea(idea.id)}><LucidePen/>Modifier</DropdownMenuItem>
                                            <DialogTrigger render={<DropdownMenuItem variant="destructive"/>}>
                                                <LucideTrash/> Supprimer
                                            </DialogTrigger>
                                        </DropdownMenuContent>}
                                    </DropdownMenu>
                                    {idea.authorId === participant?.id && <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Supprimer l'idée</DialogTitle>
                                            <DialogDescription>Vous êtes sur le point de supprimer cette idée</DialogDescription>
                                        </DialogHeader>
                                        <p className="text-sm">En êtes-vous sûr ? </p>
                                        <DialogFooter>
                                            <DialogClose render={<Button variant={"ghost"}/>}>
                                                Annuler
                                            </DialogClose>
                                            <Button variant={"destructive"} onClick={() => handleIdeaDelete(idea.id)}>Supprimer</Button>
                                        </DialogFooter>
                                    </DialogContent>}
                                </Dialog>}
                            </div>
                                
                            <CardHeader className="p-0 flex-1 flex flex-col items-center justify-center gap-1 text-center min-h-[5em]">
                                <CardTitle>
                                    {idea.name}
                                </CardTitle>
                                {idea.link && <Button variant={"link"} render={<a href={idea.link} target="_blank"/>}><LucideExternalLink/>Voir l'idée</Button>}
                            </CardHeader>
                            <CardFooter className="p-0 relative">
                                <Button tabIndex={-1} className="opacity-0 pointer-events-none"/>
                                <div className="absolute left-0 bottom-0 w-full transition-all group-hover:opacity-0 group-hover:-translate-y-2">
                                    {idea.participants.length > 0 && <p className="text-sm text-center"><LucideCheckCircle2 className="inline size-[1em]"/> {participantsString(idea.participants)}</p>}
                                </div>
                                <div className="absolute left-0 bottom-0 w-full flex gap-2 opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                                    {idea.participants.length === 0 && <Button className="flex-1" disabled={ideaLoading === idea.id} onClick={() => handleIdeaBook(idea.id)}>{ideaLoading === idea.id && <Spinner/>}Je le prends</Button>}
                                    {idea.participants.length > 0 && !idea.participants.map(p => p.id).includes(participant?.id ?? -1) && <Button className="flex-1" disabled={ideaLoading === idea.id} onClick={() => handleIdeaBook(idea.id)}>{ideaLoading === idea.id && <Spinner/>}Je participe</Button>}
                                    {participant && idea.participants.map(p =>p.id).includes(participant.id) && <Button className="flex-1" variant={"outline"} disabled={ideaLoading === idea.id} onClick={() => handleIdeaUnbook(idea.id)}>{ideaLoading === idea.id && <Spinner/>}Annuler</Button>}
                                </div>
                            </CardFooter>
                            </div>}
                        </Card>)}
                    {entity.allowIdeaProposal && !newIdea &&<Card className={cn("border-2 border-dashed p-0 min-h-[15ch]")}>
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
                        <Button onClick={handleSavingDisabledPrivacy} variant={"outline"}>Afficher quand même la liste</Button>
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
                <div className="flex gap-2 flex-wrap">{entity.participants.map(({id, name}) => <Button variant={participant?.id === id ? "default" : "outline"} onClick={() => handleParticipantSelect(id)}>{name}</Button>)}</div>
            </DialogContent>
        </Dialog>
    </div>
}

export function ListTeaser({entity}: {entity: ListType}) {
    return <Item variant={"outline"} render={<Link to={`/list/${entity.id}`}/>}>
        <ItemContent>
            <ItemTitle>{entity.name}</ItemTitle>
            <ItemDescription>
                <div>{entity.participants.length} participants</div>
                <div>{entity.ideas.length} idées</div>
            </ItemDescription>
        </ItemContent>
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
    } = useForm<ListEditionType>({defaultValues: entity ?? {}})
    const ideas = useFieldArray({name: 'ideas', control})
    const participants = useFieldArray({name: 'participants', control})

      useEffect(() => {
    // make sure to unsubscribe;
    const unsubscribe = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        console.log('coucou', values)
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
        <Button variant={"ghost"} render={<Link to='/'/>}>Annuler</Button>
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
                                <Dialog>
                                    <DialogTrigger render={<InputGroupButton type="button" variant={"ghost"}/>}>
                                        <LucideX/>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Retirer le participant</DialogTitle>
                                            <DialogDescription>Attention, cette action est irréversible</DialogDescription>
                                        </DialogHeader>
                                        En êtes-vous sûr ?
                                        <div className="flex justify-end gap-2">
                                            <DialogClose render={<Button variant="ghost"/>}>Annuler</DialogClose>
                                            <Button type="button" variant={"destructive"} onClick={() => participants.remove(index)}>Retirer {field.name}</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </InputGroupAddon>
                        </InputGroup>)}
                    </div>
                    <Button type="button" variant={"outline"} className="border-2 border-dashed" onClick={() => participants.append({name: pickValue(exampleProviders)})}><LucidePlus/>Ajouter un participant</Button>
                </Field>
                <Field orientation={"horizontal"}>
                    <Switch id="allowIdeaProposal" {...register("allowIdeaProposal")} checked={values?.allowIdeaProposal ?? false} onCheckedChange={(value) => setValue("allowIdeaProposal", value)}/>
                    <FieldLabel htmlFor="allowIdeaProposal">
                            Accepter les propositions d'idées
                            <Tooltip>
                                <TooltipTrigger render={<Button variant={"ghost"} size="icon-sm"/>}>
                                    <LucideCircleQuestionMark/>
                                </TooltipTrigger>
                                <TooltipContent>Les participants pourront ajouter des idées à cette liste</TooltipContent>
                            </Tooltip>
                    </FieldLabel>
                </Field>
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
                        <Dialog>
                            <Tooltip>
                                <TooltipTrigger render={<DialogTrigger render={<InputGroupButton type="button" variant={"ghost"}/>}/>}>
                                    <LucideX/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Supprimer l'idée
                                </TooltipContent>
                            </Tooltip>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Supprimer l'idée</DialogTitle>
                                    <DialogDescription>Attention, cette action est irréversible</DialogDescription>
                                </DialogHeader>
                                En êtes-vous sûr ?
                                <div className="flex justify-end gap-2">
                                    <DialogClose render={<Button variant="ghost"/>}>Annuler</DialogClose>
                                    <Button type="button" variant={"destructive"}onClick={() => ideas.remove(index)}>Supprimer l'idée</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </InputGroupAddon>
                    <InputGroupAddon align={"block-end"} className="justify-end">
                        {field.link !== null && <InputGroup>
                            <InputGroupAddon align={"inline-start"}><LucideLink/></InputGroupAddon>
                            <InputGroupInput {...register(`ideas.${index}.link`)}/>
                            <InputGroupAddon align={"inline-end"}>
                                <Tooltip>
                                    <TooltipTrigger render={ <InputGroupButton type="button" variant={"ghost"}/>} onClick={() => ideas.update(index, {...getValues(`ideas.${index}`), link: null})}>
                                        <LucideX/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Supprimer le lien
                                    </TooltipContent>
                                </Tooltip>
                            </InputGroupAddon>
                        </InputGroup>}
                        {field.link == null && <Button variant="ghost" onClick={() => ideas.update(index, {...getValues(`ideas.${index}`), link: ""})}><LucidePlus/>Ajouter un lien</Button>}
                    </InputGroupAddon>
                </InputGroup>)}
                <Button type="button" variant={"outline"} className="border-2 border-dashed w-full h-auto md:min-h-[15ch]" onClick={() => ideas.append({name: pickValue(exampleIdeas), link: null})}><LucidePlus/>Ajouter une idée</Button>
            </div>
            {values && values.allowIdeaProposal && <div>
                {entity && privacy && <Button variant={"link"} onClick={() => saveDisabledPrivacy(entity.id??"")}><LucideEye/>Afficher les idées proposées par les participants</Button>}
                {entity && !privacy && <Button variant={"link"} onClick={() => resetPrivacy(entity.id??"")}><LucideEyeOff/>Cacher les idées proposées par les participants</Button>}
            </div>}
        </FieldSet>
        <div className="md:hidden grid gap-4">
            {formActions}
        </div>
    </form>
}