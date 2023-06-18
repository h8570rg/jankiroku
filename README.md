# janreco

Janreco is a Mahjong management application。

# Quick Start

## Clone repository

```shell
git clone https://github.com/h8570rg/janreco.git
cd janreco
npm install
```

## Start supabase


Install docker desktop.

https://www.docker.com/products/docker-desktop/

Start supabase.

```shell
npm run supabase:start
```

Once all of the Supabase services are running, you'll see output containing your local Supabase credentials. It should look like this, with urls and keys that you'll use in your local project:

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJh......
service_role key: eyJh......
```


## Create env

```shell
cp .env.example .env.local
```

Set envs.
```
NEXT_PUBLIC_SUPABASE_URL=<API URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

## Apply DB schema

```shell
npm run supabase:reset
```

## Start

```shell
npm run dev
```

url: http://localhost:3001

supabase studio url: http://localhost:54323

# Links

- [supabase](https://supabase.com/docs)


# Sequence

## Client Component
```mermaid
sequenceDiagram
  box  Client
  participant CC as Client Component
  participant H as Hooks
  end
  box  Next Server
  participant AR as Api Routes
  participant SC as Server Component
  participant SV as Service
  participant MD as Model
  participant RP as Repository
  end
  box Supabase
  participant SB as Supabase
  end

  %% server component
  SC->>SV: 
  SV->>RP: 
  RP->>SB: 
  SB->>RP: 
  RP->>SV: 
  SV->>MD: 
  MD->>SV: 
  SV->>SC: 
```
## Server Component

```mermaid
sequenceDiagram
  box  Client
  participant CC as Client Component
  participant H as Hooks
  end
  box  Next Server
  participant AR as Api Routes
  participant SC as Server Component
  participant SV as Service
  participant MD as Model
  participant RP as Repository
  end
  box Supabase
  participant SB as Supabase
  end

  %% server component
  CC->>H: 
  H->>AR: 
  AR->>SV: 
  SV->>RP: 
  RP->>SB: 
  SB->>RP: 
  RP->>SV: 
  SV->>MD: 
  MD->>SV: 
  SV->>AR: 
  AR->>H: 
  H->>CC: 
```