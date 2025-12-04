import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { Title } from "@/components/ui/title"
import type { IdeaInsertType, ListInsertType, ListType } from "api/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { LucideCheckCircle2, LucideExternalLink, LucideEye, LucideEyeOff, LucidePen, LucidePlus, LucidePlusCircle, LucideX } from "lucide-react"
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
import { availableColors, backgroundColorMapping } from "./idea"

function participantsString(participants: string[]) {
    if (participants.length == 0) return ""
    if (participants.length == 1) return `${participants[0]} s'en occupe`
    
    const lastParticipant = participants[participants.length-1]
    const otherParticipants = participants.slice(0, -1)
    return `${otherParticipants.join(', ')} et ${lastParticipant} s'en occupent`
}

export function ListDetails({entity}: {entity: ListType}) {
    const store = useAppStore()
    const participant = useMemo(() => store.participations[entity.id], [store.participations])
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
        await client.idea[':id'].book.$post({param: {id: String(id)}, json: {user: store.user.id, token: store.user.token, participant}})
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
        await client.idea[':id'].unbook.$post({param: {id: String(id)}, json: {user: store.user.id, token: store.user.token, participant}})
        queryClient.invalidateQueries({queryKey: ['list', entity.id]})
    }

    function handleParticipantSelect(participant: string) {
        store.setParticipation(entity.id, participant)
        participationDialog.close()
    } 

    useEffect(() => {
        if (autoBook && participant) {
            submitIdeaBook(autoBook)
            setAutoBook(undefined)
        }
    }, [autoBook, participant])

    return <div className="space-y-6">
        <div className="grid md:flex gap-4 items-center">
            <Title variant={"h1"}>{entity.name}</Title>
            {entity.authorId === store.user?.id && <Button asChild><Link to={`/list/${entity.id}/edit`}><LucidePen/>Modifier la liste</Link></Button>}
            {entity.authorId === store.user?.id && privacy && <Button variant={"outline"} onClick={() => setPrivacy(false)}><LucideEye/>Voir la liste</Button>}
            {entity.authorId === store.user?.id && !privacy && <Button variant={"outline"} onClick={handleResetPrivacy}><LucideEyeOff/>Cacher la liste</Button>}
        </div>
        <div className="relative">
            <div className={cn("space-y-6 transition-all", entity.authorId === store.user?.id && privacy && "blur-xl")}>
                <div className='grid [--size:15ch] md:[--size:20ch] grid-cols-[repeat(auto-fill,minmax(var(--size),1fr))] gap-4'>
                    {entity.ideas.map(idea => <Card key={`idea-${idea.id}`} className={cn("p-0 gap-4 aspect-square", (idea.participants??[]).length > 0 && "border-primary", (idea.color && idea.color in backgroundColorMapping) ? backgroundColorMapping[idea.color] : backgroundColorMapping.default)}>
                        <CardHeader className="p-4 pb-0 flex-1 flex flex-col items-center justify-center gap-1 text-center">
                            <CardTitle>
                                {idea.name}
                            </CardTitle>
                            {idea.link && <Button variant={"link"} asChild><a href={idea.link} target="_blank"><LucideExternalLink/>Voir le produit</a></Button>}
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 block space-y-4">
                            {(idea.participants??[]).length > 0 && <p className="text-sm"><LucideCheckCircle2 className="inline size-[1em]"/> {participantsString(idea.participants??[])}</p>}
                            {(idea.participants??[]).length === 0 && <Button className="w-full" onClick={() => handleIdeaBook(idea.id)}>Je le prends</Button>}
                            {(idea.participants??[]).length > 0 && !(idea.participants??[]).includes(participant) && <Button className="w-full" onClick={() => handleIdeaBook(idea.id)}>Je participe</Button>}
                            {participant && (idea.participants??[]).includes(participant) && <Button className="w-full" variant={"outline"} onClick={() => handleIdeaUnbook(idea.id)}>Annuler</Button>}
                        </CardFooter>
                    </Card>)}
                </div>
                <div className="flex items-center gap-2">
                    {participant && <p className="text-muted-foreground text-sm">Vous participez à cette liste en tant que {participant}.</p>}
                    {!participant && <p className="text-muted-foreground text-sm">Vous ne participez pas encore à cette liste.</p>}
                    <Button variant={"outline"} size="sm" {...participationDialog.triggerProps}>{participant ? "Changer" : "Participer"}</Button>
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
                        <Button variant={"outline"} onClick={() => setPrivacy(false)}>Afficher la liste juste pour cette fois</Button>
                        <Button onClick={handleSavingDisabledPrivacy}>Toujours afficher la liste</Button>
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
                <div className="flex gap-2 flex-wrap">{entity.participants?.map(participantItem => <Button variant={participant === participantItem ? "default" : "outline"} onClick={() => handleParticipantSelect(participantItem)}>{participantItem}</Button>)}</div>
            </DialogContent>
        </Dialog>
    </div>
}

export function ListTeaser({entity}: {entity: ListType}) {
    return <Button variant={"ghost"} className="block h-auto text-left" asChild>
        <Link to={`/list/${entity.id}`}>
            <div className="mb-1">{entity.name}</div>
            <div className="text-muted-foreground text-xs font-normal">{(entity.participants??[]).length} participants</div>
            <div className="text-muted-foreground text-xs font-normal">{(entity.ideas??[]).length} idées</div>
        </Link>
    </Button>
}

type ListEditionType = Omit<ListInsertType, 'participants'> & {ideas: IdeaInsertType[], participants: {name: string}[]}

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
    const navigate = useNavigate()
    const {user} = useAppStore()
    if (!user) return

    const {
        register,
        handleSubmit,
        control,
        getValues
    } = useForm<ListEditionType>({defaultValues: entity ?? {}})
    const ideas = useFieldArray({name: 'ideas', control})
    const participants = useFieldArray({name: 'participants', control})

    const onSubmit: SubmitHandler<ListEditionType> = async (data) => {
        const listData = {
            ...data,
            user: user.id, 
            token: user.token, 
            participants: data.participants.map(p => p.name),
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
    }

    return <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-[30ch_1fr] gap-6">
        <FieldSet>
            <FieldLegend>Paramètres de la liste</FieldLegend>
            <FieldDescription>Fournissez les informations nécessaires au bon fonctionnement de votre liste.</FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Nom de la liste</FieldLabel>
                    <Input defaultValue={"Ma super liste de noël 2025"} {...register("name")} />
                </Field>
            </FieldGroup>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Participants</FieldLabel>
                    <div className="grid gap-2">
                        {participants.fields.map((field, index) => <div className="flex gap-2" key={field.id}>
                            <Input {...register(`participants.${index}.name`)} />
                            <Button type="button" variant={"outline"} size={"icon"} onClick={() => participants.remove(index)}><LucideX/></Button>
                        </div>)}
                    </div>
                    <Button type="button" variant={"outline"} onClick={() => participants.append({name: pickValue(exampleProviders)})}><LucidePlus/>Ajouter un participant</Button>
                </Field>
            </FieldGroup>
            <Separator/>
            <div className="hidden md:grid gap-4">
                <Button type="submit">{entity ? "Enregistrer la liste" : "Créer la liste"}</Button>
                {entity && <Dialog>
                    <DialogTrigger asChild>
                        <Button type="button" variant={"destructive"}>Supprimer la liste</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Etes-vous sûr ?</DialogTitle>
                            <DialogDescription>Vous êtes sur le point de supprimer définitivement cette liste.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-2 justify-end">
                            <DialogClose asChild>
                                <Button type="button" variant={"ghost"}>Annuler</Button>
                            </DialogClose>
                            <Button type="button" variant={"destructive"}>Supprimer la liste</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>}
            </div>
        </FieldSet>
        <FieldSet>
            <FieldLegend>Trouvez des idées originales</FieldLegend>
            <FieldDescription>Chaque participant pourra ensuite choisir la ou les idées qui l'intéressent.</FieldDescription>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(20ch,1fr))] gap-4">
                {ideas.fields.map((field, index) => <Card key={field.id} className="md:aspect-square p-0">
                    <CardContent className="p-4">
                        <FieldGroup>
                            <Field>
                                <div className="flex gap-2 items-center">
                                    <FieldLabel htmlFor={`ideas.${index}.name`} className="flex-1">Idée n°{index+1}</FieldLabel>
                                    <Button type="button" variant={"ghost"} size={"icon-sm"} onClick={() => ideas.remove(index)}><LucideX/></Button>
                                </div>
                                <Textarea {...register(`ideas.${index}.name`)}/>
                                {field.link === null && <Button type="button" variant="link" size="sm" className="text-left justify-start" onClick={() => ideas.update(index, {...getValues(`ideas.${index}`), link: ""})}><LucidePlusCircle/>Ajouter un lien</Button>}
                            </Field>
                            {field.link !== null && <Field>
                                <div className="flex gap-2 items-center">
                                    <FieldLabel htmlFor={`ideas.${index}.link`} className="flex-1">Lien</FieldLabel>
                                    <Button type="button" variant="link" className="p-0 h-auto" onClick={() => ideas.update(index, {...getValues(`ideas.${index}`), link: null})}><LucideX/>Retirer le lien</Button>    
                                </div>
                                <Input {...register(`ideas.${index}.link`)}/>
                            </Field>}
                        </FieldGroup>
                    </CardContent>
                </Card>)}
                <Button type="button" variant={"outline"} className="border-2 border-dashed md:aspect-square w-full h-auto" onClick={() => ideas.append({name: pickValue(exampleIdeas), link: null})}>Ajouter une idée</Button>
            </div>
        </FieldSet>
        <div className="md:hidden grid gap-4">
            <Button type="submit">{entity ? "Enregistrer la liste" : "Créer la liste"}</Button>
            {entity && <Dialog>
                <DialogTrigger asChild>
                    <Button type="button" variant={"destructive"}>Supprimer la liste</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Etes-vous sûr ?</DialogTitle>
                        <DialogDescription>Vous êtes sur le point de supprimer définitivement cette liste.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant={"ghost"}>Annuler</Button>
                        </DialogClose>
                        <Button type="button" variant={"destructive"}>Supprimer la liste</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>}
        </div>
    </form>
}