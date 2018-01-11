import ojs= require('orientjs');
import winston=require('winston');
import Promise=require('bluebird');

const VERTEX_SUPER_CLASS="V"
const USER="User";
const PROJECT="Project";
const THREAD="Thread";
const COMMENT="Comment";
const PROGRESSION="Progression";
const CONTRIBUTION="Contribution";

export class SchemaBackend{

	constructor(private db:ojs.Db){
	}

	/**
	 * Warning: Drops the entire DB unsafely.
	 * Returns with the promise of the last class dropped in order
	 */
	dropDatabaseSchema():Promise<any>{
		winston.warn("DROPPING DB UNSAFELY!!!");

		return this.db.query("DROP CLASS "+PROJECT+" IF EXISTS UNSAFE").
		then((v:any)=>{
			return this.db.query("DROP CLASS "+COMMENT+" IF EXISTS UNSAFE");
		}).
		then((v:any)=>{
			return this.db.query("DROP CLASS "+THREAD+" IF EXISTS UNSAFE");
		}).
		then((v:any)=>{
			return this.db.query("DROP CLASS "+PROGRESSION+" IF EXISTS UNSAFE");
		}).
		then((v:any)=>{
			return this.db.query("DROP CLASS "+CONTRIBUTION+" IF EXISTS UNSAFE");
		}).
		then((v:any)=>{
			return this.db.query("DROP CLASS "+USER+" IF EXISTS UNSAFE")
		})
		
	}

	/**
	 * Checks if the classes in the database exist or not,
	 * and if not, creates the required classes.
	 */
	ensureDatabaseSchema():Promise<ojs.Class>{
		winston.info("Generating dummy database");
		return this.ensureUser().
		then((createdClass:ojs.Class)=>{
			return this.ensureProject();
		}).
		then((c:ojs.Class)=>{
			return this.ensureUserHasReferencesToProject();
		}).
		then((c:ojs.Class)=>{
			return this.ensureComment();
		}).
		then((c:ojs.Class)=>{
			return this.ensureThread();
		}).
		then((c:ojs.Class)=>{
			return this.ensureContribution();
		}).
		then((c:ojs.Class)=>{
			return this.ensureProgression();
		}).
		then((c:ojs.Class)=>{
			return this.ensureProjectLinksToProgression();
		}).
		then((c:ojs.Class)=>{
			return this.ensureProjectLinksToThread();
		})
	}

	private ensureUser():Promise<ojs.Class>{
		return this.createClassIfNotExists(USER,[
			{name:"firstName",type:"String"},
			{name:"lastName",type:"String"},
			{name:"email",type:"String"},
			{name:"password",type:"String"},
			{name:"gender",type:"String"},
			{name:"thumbnailUrl",type:"String"},
			{name:"dateOfBirth",type:"Date"}
		],VERTEX_SUPER_CLASS);//extends the generic 'Vertex' class
	}

	private ensureProject():Promise<ojs.Class>{
		return this.createClassIfNotExists(PROJECT,[
			{name:"title",type:"String"},
			{name:"tldr",type:"String"},
			{name:"description",type:"String"},
			{name:"headerUrl",type:"String"},
			{name:"mediumPhotoUrl",type:"String"},
			{name:"techStack",type:"EmbeddedList", linkedType:"String"},
			{name:"createdBy",type:"Link", linkedClass:USER},
			{name:"contributorList",type:"LinkList", linkedClass:USER},
			{name:"mentorList",type:"LinkList", linkedClass:USER},
			
		],VERTEX_SUPER_CLASS);
	}

	private ensureUserHasReferencesToProject():Promise<ojs.Class>{
		return this.db.class.get(USER).
		then((c:ojs.Class)=>{
			return c.property.get("projectsContributed").
			then((projectsContributedProperty:ojs.Property)=>{
				if(projectsContributedProperty==null){
					winston.info("Adding projects contributed attribute to User class");
					return c.property.create({name:"projectsContributed", type:"LinkList", linkedClass:PROJECT}).
					then((p:ojs.Property)=>{
						return c;
					})
				}else{
					return c;
				}
			})
		}).
		then((c:ojs.Class)=>{
			return c.property.get("projectsMentored").
			then((projectsMentored:ojs.Property)=>{
				if(projectsMentored==null){
					winston.info("Adding projects mentored attribute to User class");
					return c.property.create({name:"projectsMentored", type:"LinkList", linkedClass:PROJECT}).
					then((p:ojs.Property)=>{
						return c;
					})
				}else{
					return c;
				}
			});
		});
	}

	private ensureComment():Promise<ojs.Class>{
		return this.createClassIfNotExists(COMMENT,[
			{name:"message",type:"String"},
			{name:"timestamp",type:"Date"},
			{name:"poster",type:"Link",linkedClass:USER},
		],VERTEX_SUPER_CLASS);
	}

	private ensureThread():Promise<ojs.Class>{
		return this.createClassIfNotExists(THREAD,[
			{name:"title",type:"String"},
			{name:"description",type:"String"},
			{name:"timestamp",type:"Date"},
			{name:"poster",type:"Link",linkedClass:USER},
			{name:"commentList",type:"LinkList",linkedClass:COMMENT},
		],VERTEX_SUPER_CLASS);
	}

	private ensureProgression():Promise<ojs.Class>{
		return this.createClassIfNotExists(PROGRESSION,[
			{name:"updates",type:"LinkList",linkedClass:CONTRIBUTION},
		],VERTEX_SUPER_CLASS);
	}

	private ensureContribution():Promise<ojs.Class>{
		return this.createClassIfNotExists(CONTRIBUTION,[
			{name:"message",type:"String"},
			{name:"timestamp",type:"Date"},
			{name:"user",type:"Link",linkedClass:USER},
		],VERTEX_SUPER_CLASS);
	}

	private ensureProjectLinksToProgression():Promise<ojs.Class>{
		return this.db.class.get(PROJECT).
		then((c:ojs.Class)=>{
			return c.property.get("progression").
			then((progresssion:ojs.Property)=>{
				if(progresssion==null){
					winston.info("Creating a link between project and progression");
					return c.property.create({name:"progression", type:"Link", linkedClass:PROGRESSION}).
					then((p:ojs.Property)=>{
						return c;
					})
				}else{
					return c;
				}
			})

		})
	}

	private ensureProjectLinksToThread():Promise<ojs.Class>{
		return this.db.class.get(PROJECT).
		then((c:ojs.Class)=>{
			return c.property.get("threadList").
			then((threadList:ojs.Property)=>{
				if(threadList==null){
					winston.info("Creating a link between project and thread(as a list)");
					return c.property.create({name:"threadList", type:"LinkList", linkedClass:THREAD}).
					then((p:ojs.Property)=>{
						return c;
					})
				}else{
					return c;
				}
			});
		})
	}

	/**
	 * Creates a class that can optionally extend another 'known' class.
	 * The properties  is an array of properties 'with known types'.
	 * Meaning that a property can only refer a type that has been defined previously
	 * Each element must be of the form {name:"<name>",type:"<type>"} plus more(refer Property interface)
	 * Example:
	 * {name:"lastName",type:"String"},
	 * {name:"dateOfBirth",type:"Date"},
	 * {name:"favoriteWords",type:"EmbeddedList", linkedType:"String"},
	 * {name:"address",type:"Embedded", linkedClass:"Location"},//Location must be defined earlier
	 * @return the created/existing class as a promise.(Does not change properties of existing class)
	 */
	public createClassIfNotExists(className:string,propertiesWithKnownTypes:any[],superClass:string=null):Promise<ojs.Class>{
		return this.db.class.list(true).
		then((classes:ojs.Class[])=>{
			let existingClass:ojs.Class=null;
			winston.log("info","Searching for '"+className+"' class amongst "+classes.length+" classes");
			for(let singleClass of classes){
				if(singleClass.name==className){
					existingClass=singleClass
					break;
				}
			}
			return existingClass;
		}).then((existingClass:ojs.Class)=>{

			if(existingClass!=null){
				winston.info(existingClass.name+" class already exists");
				return existingClass;
			}else{
				let afterClassIsCreated:Promise<ojs.Class>=null;
				if(superClass==null || superClass.trim()==""){
					afterClassIsCreated=this.db.class.create(className);
				}else{
					afterClassIsCreated=this.db.class.create(className,superClass);
				}
				
				return afterClassIsCreated.
				then((createdClass:ojs.Class)=>{
					winston.info("Not found, Created class : "+createdClass.name);
					winston.info("Defining properties for class : "+createdClass.name);
					return createdClass.property.create(propertiesWithKnownTypes).
					then((properties:ojs.Property[])=>{
						return createdClass;
					});
				});
			}
			
		});
	}
}