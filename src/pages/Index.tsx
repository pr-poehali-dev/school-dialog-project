import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const PRINCIPAL_PHOTO =
  'https://cdn.poehali.dev/projects/232d6207-a596-4dad-9606-e8bc24512edc/bucket/7d73ee82-d1fd-43a8-b763-3e9d41c69508.jpg';

interface FaqItem {
  id: number;
  icon: string;
  question: string;
  answer: string;
}

const FAQ: FaqItem[] = [
  {
    id: 1,
    icon: 'Mountain',
    question:
      'С какими неудачами и разочарованиями вам приходилось сталкиваться в своей жизни и как вы с ними справлялись?',
    answer:
      'В самом начале своего профессионального пути я испытала горькое разочарование. Окончила школу с серебряной медалью, мечтала о карьере журналиста, но в ВУЗ не поступила: не хватило одного балла. В тот момент казалось, что мир рушится. Я выбрала другой путь, стала студенткой Кемеровского педагогического колледжа, получила специальность учителя русского языка и литературы. Годы учебы в колледже стали для меня по-настоящему важными: они научили меня терпению, эмпатии, умению говорить с людьми так, чтобы они слышали. Именно тогда я встретила людей, с которыми уже 25 лет работаю в системе образования родного города. Профессия педагога стала моей судьбой. Уже после колледжа я окончила Кемеровский государственный университет и исполнила свою мечту. Благодаря этой жизненной ситуации я точно знаю: иногда то, что мы считаем неудачей, становится началом чего-то большего.',
  },
  {
    id: 2,
    icon: 'BookOpen',
    question: 'У вас есть хобби?',
    answer:
      'Если у меня появляется свободный час, я тут же беру в руки книгу. Люблю читать, потому что это приключение без чемоданов и билетов. Особенно люблю детективы Артура Конан Дойля и Агаты Кристи. Каждый такой роман — увлекательная тренировка для ума.',
  },
  {
    id: 3,
    icon: 'Heart',
    question: 'Кто поддерживает вас и мотивирует на свершения?',
    answer:
      'Мой надёжный тыл — это моя семья: муж и мои дочки. Именно семья помогает сохранять баланс и помнить о главном — людях и доверии.',
  },
  {
    id: 4,
    icon: 'Compass',
    question:
      'Что бы вы сказали себе 6 лет назад в самом начале директорского пути?',
    answer:
      '«Ты справишься! Не пытайся сразу всё исправить и всем понравиться. Сначала слушай учителей, детей и родителей. Фиксируй маленькие победы и доверяй своей команде».',
  },
  {
    id: 5,
    icon: 'Star',
    question: 'С какими известными людьми вы встречались на профессиональном пути?',
    answer:
      'В моей жизни были встречи с выдающимися педагогами. Особенно запомнились встречи с Шалвой Александровичем Амонашвили и Евгением Александровичем Ямбургом, которые оказали большое влияние на мои профессиональные взгляды.',
  },
];

const BACKGROUND_ICONS: { name: string; className: string; size: number }[] = [
  { name: 'BookOpen', className: 'top-[8%] left-[6%] animate-float-slow', size: 90 },
  { name: 'Globe', className: 'top-[18%] right-[8%] animate-float-slow [animation-delay:1.5s]', size: 110 },
  { name: 'Pencil', className: 'top-[42%] left-[3%] animate-float-slow [animation-delay:0.8s]', size: 70 },
  { name: 'Ruler', className: 'top-[60%] right-[5%] animate-float-slow [animation-delay:2.2s]', size: 80 },
  { name: 'Bell', className: 'top-[74%] left-[10%] animate-float-slow [animation-delay:1.1s]', size: 76 },
  { name: 'GraduationCap', className: 'top-[30%] left-[46%] animate-float-slow [animation-delay:2.8s]', size: 96 },
  { name: 'Book', className: 'top-[88%] right-[14%] animate-float-slow [animation-delay:0.4s]', size: 84 },
];

const Index = () => {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<number | null>(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', question: '' });
  const [sending, setSending] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return FAQ;
    return FAQ.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q),
    );
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('https://functions.poehali.dev/9479f46e-608f-45ee-9150-9dc7fdaae786', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setModalOpen(false);
      setForm({ name: '', email: '', question: '' });
      toast.success('Спасибо! Ваш вопрос отправлен директору школы.', { duration: 5000 });
    } catch {
      toast.error('Не удалось отправить вопрос. Попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Декоративный фон */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute -left-40 top-[-10%] h-[480px] w-[480px] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute -right-40 top-[40%] h-[520px] w-[520px] rounded-full bg-accent/10 blur-[130px]" />
        {BACKGROUND_ICONS.map((ic) => (
          <div key={ic.name + ic.className} className={`absolute text-primary/[0.06] ${ic.className}`}>
            <Icon name={ic.name} size={ic.size} strokeWidth={1.2} />
          </div>
        ))}
      </div>

      <main className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
        {/* HERO */}
        <section className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          {/* Фото */}
          <div className="animate-rise flex justify-center md:order-1 md:justify-start">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-secondary/30 blur-3xl animate-glow" aria-hidden />
              <div className="absolute -inset-4 animate-ring-spin rounded-full border-2 border-dashed border-secondary/40" aria-hidden />
              <div className="absolute -inset-1 rounded-full border-4 border-accent/40" aria-hidden />
              <img
                src={PRINCIPAL_PHOTO}
                alt="Киселева Марина Ивановна — директор МБОУ «СОШ №45» г. Кемерово"
                loading="lazy"
                className="relative h-60 w-60 rounded-full object-cover shadow-2xl shadow-primary/20 ring-4 ring-white sm:h-72 sm:w-72 md:h-80 md:w-80"
              />
            </div>
          </div>

          {/* Текст */}
          <div className="animate-rise [animation-delay:0.15s]">
            <Badge className="mb-5 rounded-full bg-secondary/15 px-4 py-1.5 text-sm font-semibold text-secondary hover:bg-secondary/15">
              <Icon name="MessagesSquare" size={15} className="mr-1.5" />
              Виртуальное интервью
            </Badge>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-primary text-balance sm:text-5xl">
              Диалог с директором
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground text-balance">
              Узнайте больше о профессиональном пути, увлечениях и взглядах
              руководителя школы
            </p>

            {/* Карточка профиля */}
            <div className="glass mt-8 flex items-center gap-4 rounded-[20px] p-5 shadow-xl shadow-primary/5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                <Icon name="UserRound" size={26} />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-bold text-primary">
                  Киселева Марина Ивановна
                </p>
                <p className="text-sm text-muted-foreground">
                  Директор МБОУ «СОШ №45» г. Кемерово
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Педагог', 'Руководитель', 'Наставник'].map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ + ПОИСК */}
        <section className="mt-20 md:mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
              Часто задаваемые вопросы
            </h2>
            <p className="mt-3 text-muted-foreground">
              Найдите интересующий вопрос или задайте свой
            </p>
          </div>

          {/* Поиск */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Icon
              name="Search"
              size={20}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Найти вопрос..."
              aria-label="Поиск по вопросам"
              className="glass h-14 rounded-full border-transparent pl-14 pr-5 text-base shadow-lg shadow-primary/5 focus-visible:ring-secondary"
            />
          </div>

          {/* Аккордеоны */}
          <div className="mx-auto mt-8 max-w-3xl space-y-4">
            {filtered.map((item, idx) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="animate-rise group rounded-[20px] border border-border/60 bg-card shadow-md shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-secondary/10"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                      <Icon name={item.icon} size={20} />
                    </span>
                    <span className="flex-1 font-display text-base font-semibold text-primary sm:text-lg">
                      {item.question}
                    </span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <Icon name={isOpen ? 'Minus' : 'Plus'} size={18} />
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-500 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-6 pl-[3.75rem] text-[15px] leading-relaxed text-muted-foreground sm:px-6 sm:pl-[5rem]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="rounded-[20px] border border-dashed border-border bg-card/50 py-12 text-center">
                <Icon name="SearchX" size={40} className="mx-auto text-muted-foreground/60" />
                <p className="mt-3 text-muted-foreground">
                  По запросу ничего не найдено. Попробуйте изменить формулировку.
                </p>
              </div>
            )}
          </div>
        </section>


      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-border/60 bg-primary text-white">
        <div className="container mx-auto max-w-6xl px-4 py-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Icon name="School" size={24} className="text-accent" />
            <p className="font-display text-lg font-bold">
              МБОУ «СОШ №45» г. Кемерово
            </p>
          </div>
          <p className="mx-auto max-w-xl text-balance text-white/70">
            «Школа — это пространство возможностей, где каждый ребёнок может
            открыть свой путь к успеху».
          </p>
        </div>
      </footer>

      {/* МОДАЛКА */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-[24px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-extrabold text-primary">
              Задать вопрос директору
            </DialogTitle>
            <DialogDescription>
              Заполните форму, и мы передадим ваш вопрос Марине Ивановне.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Как к вам обращаться"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Электронная почта</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@mail.ru"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="question">Вопрос</Label>
              <Textarea
                id="question"
                required
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="Напишите ваш вопрос..."
                rows={4}
                className="resize-none rounded-xl"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={sending}
              className="h-12 w-full rounded-full bg-primary text-base font-bold text-white transition-transform hover:scale-[1.02] hover:bg-primary/90 disabled:opacity-70"
            >
              <Icon name={sending ? 'Loader' : 'Send'} size={18} className={`mr-2 ${sending ? 'animate-spin' : ''}`} />
              {sending ? 'Отправляем...' : 'Отправить вопрос'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;