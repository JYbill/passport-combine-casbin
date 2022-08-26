# Understanding Casbin with different Access Control Model Configurations

> ACL, RBAC, ABAC

- author: Dipesh K.C.
- link: [Understanding Casbin with different Access Control Model Configurations](https://articles.wesionary.team/understanding-casbin-with-different-access-control-model-configurations-faebc60f6da5)
- date: Jun 23, 2021

Hello Developers 👋. Authorization is a key part of every system we built and Casbin is one common name we hear in every language for authorization.

Casbin currently has its support for Golang, Java, C/C++, Node.js, Javascript, PHP, Laravel, Python, .NET (C#), Delphi, Rust, Ruby, Swift (Objective-C), Lua (OpenResty), Dart (Flutter), and Elixir.

In this article, My goal is to demonstrate the working of casbin and its different available model configurations in a simple and understandable flow.

If you already know the basics of casbin and just need the implementation flow of casbin in golang, you can check my other article on Authorization in Golang Projects using Casbin.

## Workflow of Casbin

Before going on different model configurations, let's try to understand the workflow of casbin with a simple overview diagram as shown below.
![](./img/Understanding%20Casbin%20with%20different%20Access%20Control%20Model%20Configurations1.jpeg)
I have split the overall workflow into two-phase namely the Configuration and Implementation.

## Configuration Phase

This phase is all about the configurations.

### Step1 (Model)

Here we configure the model as per our requirement. We make use of the CONF file (.conf file extension) to abstract our model configuration. This configuration is based on PERM metamodel (Policy, Effect, Request, Matchers) (will go on its details below with examples).

In the above diagram, I have taken the basic and simplest model in Casbin i.e. ACL (will be discussed later)

### Step2 (Policy)

Here we define the policies like who can do what and who has what permissions

**Basic Syntax for Policy is**
`p= sub, obj, act, eft`

This syntax can be read as who(sub) can/cannot(allow/deny) do what(act) on some resource(obj)

Here eft can be either allow or deny. If it is not included, the default value is allow.

In the above diagram as per policies defined

1. John has permission to read RECORD1
2. John has no permission to write RECORD1
3. Harry has permission to read RECORD1
4. Harry has permission to write RECORD1

**Implementation Phase**
This phase is all about the implementation as per model configurations[Step 1] and listed policies [Step 2]

### Step3 (Request)

This is the real-time scenario when a user tries to access or do his desired actions on some resource.

In the above diagram as per the incoming request

1. John wants to read RECORD1
2. John wants to write on RECORD1

**Enforcement Result**

This is the real-time scenario when the decision is taken whether to allow the user to access or do his desired actions to the given resource.

### Step4 (Matcher)

The first step in enforcing results is to match the request with the policy list. In the above example, we have the following matcher expression which just guarantees subject, object, and action in a request should match the ones in a policy rule.

```ts
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act;
```

### Step5 (Policy Effect)

After finding the policy from the policy list using matcher expression, the other step in enforcing results is applying the policy effect. In the above example, we have the following policy effect which means that a user has permission as long as there is one matching policy that allows him to do so

```ts
e = some(where(p.eft == allow));
```

After these two steps casbin enforce result as

1. John is allowed to read RECORD1 ✔️
2. John is denied to write on RECORD1 ❌

# Types of Access Control

## Access Control List (ACL)

This is the most basic access control mechanism. This lists 1–1 mapping of each user's permission on a given resource.

```ts
If there are total three users;user1,user2,user3. There is a permissions defined for each users individually.
user1 can only read record1
user2 can only write record1
user3 can read and write record1
```

### Casbin Model Configuration

```bash
# Request definition
[request_definition]
r = sub, obj, act

# Policy definition
[policy_definition]
p = sub, obj, act

# Policy effect
[policy_effect]
e = some(where (p.eft == allow))

# Matchers
[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
```

- `r = sub, obj, act` gives info about who(sub) wants to do what(act) on some resource(obj)
- `p = sub, obj, act` gives info about who(sub) can do what(act) on some resource(obj)

### Policy Effect

- `e = some(where (p.eft == allow))` means that a user has permission as long as there is one matching policy that allows him to do so.

### Some Other Variations

- `e = !some(where (p.eft == deny))` means that a user has permission as long as there is no matching policy that denies him to do so
- `e = some(where (p.eft == allow)) && !some(where (p.eft == deny))` means that a user has permission as long as there is one matching policy and no matched deny policy.

### Matchers

`m = r.sub == p.sub && r.obj == p.obj && r.act == p.act` defines the workflow of authorization. It checks if a user can perform the given action(he is trying to do) on the given resource. In another term, evaluates the policy rule against the request. Here in the above matcher, subject, object, and action in a request should match the ones in a policy rule in order to grant access to the user.

## Role-Based Access Control (RBAC)

This solves the above 1–1 mapping that was required before. Now we assign the users into roles and assign permissions to the role instead of the individual users.

```ts
If there are total three users;user1,user2,user3 and two role;admin and user. In this case we define permission to the role not to the individual user.
user1,user2 has role user
user3 has role admin
user can only read record1 (user1,user2)
admin can read and write write record1 (user3)
```

### Casbin Model Configuration

```bash
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
```

Same as previous but we have added `g` parameter here

`g = _, _` defines the user's role.

```ts
// user1 is a admin and admin can write record1 which means user1 can write record1
p, admin, record1, write;
g, user1, admin;
```

## RBAC with resource Roles

Like we grouped users into roles, we can also group resources and assign them instead of assigning a single resource at a time.

```bash
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _
g2 = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && g2(r.obj, p.obj) && r.act == p.act
```

Here we have added `g2` parameter here

`g2 = _, _` defines the resource’s role.

```ts
// record1 and record2 is grouped to record and user1 can write record which means user1 can write record1 and record2 both
p, user1, record, write;
g2, record1, record;
g2, record2, record;
```

## RBAC with domains(tenants)

This is another version of RBAC and can be essential when there are multiple tenants in the system and the user has different roles in a different tenant.

```bash
[request_definition]
r = sub, dom, obj, act

[policy_definition]
p = sub, dom, obj, act

[role_definition]
g = _, _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub, r.dom) && r.dom == p.dom && r.obj == p.obj && r.act == p.act
```

```ts
//user1 is admin in tenant1 and user2 is admin in tenant2. Admin in tenant1(which means user1) can read and write data1. Similarly Admin in tenant2(which means user2) can read and write data2. This also means user1 has no permission to read/write data2 and viceversa.
p, admin, tenant1, data1, read;
p, admin, tenant1, data1, write;
p, admin, tenant2, data2, read;
p, admin, tenant2, data2, write;
g, user1, admin, tenant1;
g, user2, admin, tenant2;
```

## Attribute-Based Access Control (ABAC)

If your use case cannot be solved by any of the above models, there is another model which provides more granular search/matchers. The evaluation is done based on specific attributes(like user attributes). In the case of casbin, the attributes can be properties of the subject, object, or actions.

For example, an RBAC system grants access to all managers, but an ABAC policy will only grant access to managers that are in the financial department

```bash
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == r.obj.Owner
```

This modal configuration just checks if the user requesting is the owner of that requested object.

```ts
//If Following Request
user1, { Owner: 'user1' };
user1, { Owner: 'user2' };
//Mapping the request to sub,obj,act
sub = user1;
obj = { Owner: 'user1' };
//Matchers we have
r.sub == r.obj.Owner;
user1 == user1; // 1st Request is given access
user1 == user2; // 2nd Request is not given access as he is not the                   .                 owner of that resource
```

Similarly, there are many more models available for different use cases. My goal was to make you get started with casbin. Now I hope you can continue learning more depth knowledge with this [documentation](https://casbin.io/zh/docs/overview) or play with models and policy in casbin online editor.

# CONCLUSION

This is the end of this article in understanding casbin. We will continue this journey of understanding casbin to implementing casbin in golang in the next article. Hope this article was of some help to my readers. Any kind of suggestions would be highly appreciable. Happy Coding ☺.
