# WYPOZYCZENIE-SPRZETU-BACKEND — notatki developerskie

## Prisma — najczęstsze komendy

```bash
# Tworzy nową migrację i synchronizuje schemat z bazą
npx prisma migrate dev --name "nazwa_migracji"

# Regeneruje Prisma Client (metody dostępne w kodzie) na podstawie schema.prisma
npx prisma generate

# Pokazuje różnice pomiędzy ostatnią migracją a aktualnym schema.prisma
# UWAGA: wymaga shadowDatabaseUrl w konfiguracji (odkomentować w prisma.config.ts)
# shadowDatabaseUrl teoretycznie nie może wskazywać na tę samą bazę co główny url
npx prisma migrate diff --from-migrations ./prisma/migrations --to-schema-datamodel ./prisma/schema.prisma --script

# Seedowanie bazy danych (przydatne po resecie środowiska deweloperskiego)
npx prisma db seed
```

> Do zweryfikowania: flaga do porównania ze schematem to `--to-schema-datamodel`, a nie `--to-schema` — sprawdź w swojej wersji Prisma (`npx prisma migrate diff --help`), bo nazwy flag zmieniały się między wersjami.

---

## Konwencje nazewnictwa (layered architecture)

| Warstwa      | Metody |
|--------------|--------|
| Repository   | `find`, `findById`, `insert`, `update`, `remove` |
| Service      | `get`, `getById`, `create`, `update`, `delete` |
| Controller   | `list`, `show`, `store`, `update`, `destroy` |

Dodatkowe ustalenia:
- Pliki: `*.controller.js`, `*.service.js`, `*.repository.js`, `*.schema.js`
- Import serwisów: `import * as xyzService from './xyz.service.js'` (unikanie kolizji nazw)
- Struktura folderów płaska, grupowana po warstwie: `controllers/`, `services/`, `repositories/`, `schemas/`, `docs/`

---

## Error handling

- Middleware do obsługi błędów **musi mieć dokładnie 4 parametry**: `(err, req, res, next)`.
  Express rozpoznaje error-handling middleware wyłącznie po liczbie parametrów — nawet jeśli `next` nie jest używane w ciele funkcji, musi być w sygnaturze. Bez tego Express traktuje funkcję jak zwykłe middleware i przesuwa argumenty (`err` trafia jako `req` itd.), co daje pozornie losowe błędy.
- Konflikt unikalności w bazie (np. Prisma `P2002`) → rzucaj `ConflictError` → HTTP **409 Conflict**.

---

## Git — podstawowy workflow

### Tworzenie nowego brancha

```bash
git checkout main
git pull origin main              # upewnij się, że main jest aktualny
git checkout -b feature/nazwa-brancha
```

> Jeśli pracujesz solo i masz pewność, że lokalny `main` jest aktualny, `git pull` przed stworzeniem brancha można pominąć — ale to jedna komenda kosztem sekundy, więc bezpieczniej robić to zawsze.

### Przełączanie się między branchami

```bash
git checkout nazwa-brancha
```

Jeśli masz niezcommitowane zmiany, których nie chcesz jeszcze commitować:

```bash
git stash              # odkłada zmiany na bok
git checkout inny-branch
# ... praca na innym branchu ...
git checkout wracam-tutaj
git stash pop           # przywraca odłożone zmiany
```

### Commit i push zmian z brancha

```bash
git add .
git commit -m "opis zmiany"
git push origin nazwa-brancha
```

### Merge brancha (np. fixa) do maina

**Przez Pull Request (rekomendowane, nawet solo — dla porządku w historii):**
Otwórz PR na GitHub/GitLab z `nazwa-brancha` → `main`, zmerguj tam, potem lokalnie:

```bash
git checkout main
git pull origin main
```

**Merge lokalny (bez PR):**

```bash
git checkout main
git merge nazwa-brancha
git push origin main
```

### Zaktualizowanie brancha feature'owego o zmiany z maina

Po zmergowaniu czegoś do `main` (np. fixa), wróć na branch feature'owy i pobierz te zmiany:

```bash
git checkout feature/nazwa-brancha
git pull origin main
```

To pobiera `main` i automatycznie merguje go do obecnego brancha (tworzy merge commit).

**Alternatywa — rebase (czystsza historia, bez merge commitów):**

```bash
git checkout feature/nazwa-brancha
git fetch origin
git rebase origin/main
```

> Rebase nadpisuje hashe commitów Twojego brancha. Jeśli branch był już wcześniej pushowany, kolejny push wymaga:
> ```bash
> git push --force-with-lease
> ```
> Bezpieczne w solo-projekcie, ryzykowne przy pracy zespołowej na tym samym branchu.

### Kiedy osobny branch, a kiedy zmiana na obecnym

- **Osobny branch** — gdy poprawka dotyczy czegoś niezwiązanego z bieżącym feature'em (np. bugfix w rdzeniu aplikacji jak `errorHandlerUtil`) i chcesz, żeby trafiła do `main` szybciej niż reszta pracy.
- **Ten sam branch** — gdy zmiana jest naturalną częścią feature'a, nad którym już pracujesz.
