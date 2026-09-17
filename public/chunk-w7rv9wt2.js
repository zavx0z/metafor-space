var D1=Object.defineProperty;var X0=($,b)=>{for(var z in b)D1($,z,{get:b[z],enumerable:!0,configurable:!0,set:(J)=>b[z]=()=>J})};var K=($,b)=>()=>($&&(b=$($=0)),b);function w0($,b){if(!G0($)||!$.hasOwnProperty("raw")){let z="invalid template strings array";throw z=`
          Внутренняя ошибка: ожидалось, что строки шаблона будут массивом с полем 'raw'.
          Вызов функций html или svg как обычных функций фактически эквивалентен вызову unsafeHtml
          и может привести к серьезным проблемам безопасности, например, к XSS-атакам.
        `.trim().replace(/\n */g,`
`),new Error(z)}return E0!==void 0?E0.createHTML(b):b}function u($,b,z=$,J){if(b===g)return b;let Z=J!==void 0?z.__directives?.[J]:z.__directive,q=s(b)?void 0:b._$htmlDirective$;if(Z?.constructor!==q){if(Z&&Z._$notifyDirectiveConnectionChanged?.(!1),q===void 0)Z=void 0;else Z=new q($),Z._$initialize($,z,J);if(J!==void 0)(z.__directives??=[])[J]=Z;else z.__directive=Z}if(Z!==void 0)b=u($,Z._$resolve($,b.values),Z,J);return b}class $0{el;parts=[];constructor({strings:$,["_$htmlType$"]:b},z={}){let J,Z=0,q=0,X=$.length-1,W=this.parts,[G,M]=S1($,b);if(this.el=$0.createElement(G,z),P.currentNode=this.el.content,b===2||b===3){let A=this.el.content.firstChild;A.replaceWith(...Array.from(A.childNodes))}while((J=P.nextNode())!==null&&W.length<X){if(J.nodeType===1){let A=J;{let U=A.localName;if(/^(?:textarea|template)$/i.test(U)&&A.innerHTML.includes(N)){let Y=`Выражения не поддерживаются внутри элементов \`${U}\`. `;if(U==="template")throw new Error(Y)}}if(A.hasAttributes()){for(let U of A.getAttributeNames())if(U.endsWith("$html$")){let Y=M[q++],_=A.getAttribute(U).split(N);if(Y==="data"||Y==="context")W.push({type:1,index:Z,name:Y,strings:_,ctor:W0});else{let Q=/([.?@])?(.*)/.exec(Y);W.push({type:1,index:Z,name:Q[2],strings:_,ctor:Q[1]==="."?W0:Q[1]==="?"?k0:Q[1]==="@"?g0:i})}A.removeAttribute(U)}else if(U.startsWith(N))W.push({type:6,index:Z}),A.removeAttribute(U)}if(C0.test(A.tagName)){let U=A.textContent?.split(N),Y=U.length-1;if(Y>0){A.textContent=t?t.emptyScript:"";for(let B=0;B<Y;B++)A.append(U[B],c()),P.nextNode(),W.push({type:2,index:++Z});A.append(U[Y],c())}}}else if(J.nodeType===8){let U=J.data;if(U===f0)W.push({type:2,index:Z});else{let Y=-1;while((Y=U.indexOf(N,Y+1))!==-1)W.push({type:7,index:Z}),Y+=N.length-1}}Z++}if(M.length!==q)throw new Error('Обнаружены повторяющиеся привязки атрибутов. Это происходит, если в вашем шаблоне есть повторяющиеся атрибуты в теге элемента. Например, "<input ?disabled=${true} ?disabled=${false}>" содержит повторяющийся атрибут "disabled". Ошибка обнаружена в следующем шаблоне: \n  strings.join("${...}")')}static createElement($,b){let z=k.createElement("template");return z.innerHTML=$,z}}class P0{_$parts=[];_$disconnectableChildren=void 0;constructor($,b){this._$template=$,this._$parent=b}get parentNode(){return this._$parent.parentNode}get _$isConnected(){return this._$parent._$isConnected}_clone($){let{el:{content:b},parts:z}=this._$template,J=($?.creationScope??k).importNode(b,!0);P.currentNode=J;let Z=P.nextNode(),q=0,X=0,W=z[0];while(W!==void 0){if(q===W.index){let G;if(W.type===2)G=new p(Z,Z.nextSibling,this,$);else if(W.type===1)G=new W.ctor(Z,W.name,W.strings,this,$);else if(W.type===6)G=new y0(Z,this,$);this._$parts.push(G),W=z[++X]}if(q!==W?.index)Z=P.nextNode(),q++}return P.currentNode=k,J}_update($){let b=0;for(let z of this._$parts){if(z!==void 0)if(z.strings!==void 0)z._$setValue($,z,b),b+=z.strings.length-2;else z._$setValue($[b]);b++}}}class p{type=2;_$committedValue=O;_textSanitizer;_$parent;_$disconnectableChildren=void 0;_$notifyConnectionChanged=void 0;_$reparentDisconnectables=void 0;get _$isConnected(){return this._$parent?._$isConnected??this.__isConnected}constructor($,b,z,J={}){this._$startNode=$,this._$endNode=b,this._$parent=z,this.options=J,this.__isConnected=J?.isConnected??!0}get parentNode(){let $=this._$startNode.parentNode,b=this._$parent;if(b!==void 0&&$?.nodeType===11)$=b.parentNode;return $}get startNode(){return this._$startNode}get endNode(){return this._$endNode}_$setValue($,b=this){if(this.parentNode===null)throw new Error("Этот `ChildPart` не имеет `parentNode` и поэтому не может принять значение. \n        Это, скорее всего, означает, что элемент, содержащий часть, \n        был изменен не поддерживаемым способом вне контроля MetaFor, \n        так что маркерные узлы части были выброшены из DOM. \n        Например, установка элемента `innerHTML` или `textContent` может сделать это.");if($=u(this,$,b),s($)){if($===O||$==null||$===""){if(this._$committedValue!==O)this._$clear();this._$committedValue=O}else if($!==this._$committedValue&&$!==g)this._commitText($)}else if($._$htmlType$!==void 0)this._commitTemplateResult($);else if($.nodeType!==void 0){if(this.options?.host===$){this._commitText("[вероятная ошибка: шаблон отрисовал свой host внутри себя (обычно возникает при написании ${this} в шаблоне)]"),console.warn(`Attempted to render the template host ${$} внутри себя. Это почти всегда ошибка, и в режиме разработки мы отображаем предупреждающий текст. Однако в продакшене мы отрисуем его, что обычно приводит к ошибке, а иногда к исчезновению элемента из DOM.`);return}this._commitNode($)}else if(N1($))this._commitIterable($);else this._commitText($)}_insert($){return this._$startNode.parentNode.insertBefore($,this._$endNode)}_commitNode($){if(this._$committedValue!==$){if(this._$clear(),y!==b0){let b=this._$startNode.parentNode?.nodeName;if(b==="STYLE"||b==="SCRIPT"){let z="Forbidden";if(b==="STYLE")z="@metafor/html не поддерживает привязку внутри узлов style. "+"Это риск безопасности, так как атаки с внедрением стилей могут "+"похищать данные и подделывать пользовательский интерфейс. "+"Вместо этого используйте литералы css`...` "+"для составления стилей и выполняйте динамическую стилизацию с помощью "+"пользовательских свойств css, ::parts, <slot>, "+"и путем изменения DOM, а не таблиц стилей.";else z="@metafor/html не поддерживает привязку внутри узлов script. "+"Это риск безопасности, так как это может позволить выполнение "+"произвольного кода.";throw new Error(z)}}this._$committedValue=this._insert($)}}_commitText($){if(this._$committedValue!==O&&s(this._$committedValue)){let b=this._$startNode.nextSibling;if(this._textSanitizer===void 0)this._textSanitizer=B0(b,"data","property");$=this._textSanitizer($),b.data=$}else{let b=k.createTextNode("");if(this._commitNode(b),this._textSanitizer===void 0)this._textSanitizer=B0(b,"data","property");$=this._textSanitizer($),b.data=$}this._$committedValue=$}_commitTemplateResult($){let{values:b,["_$htmlType$"]:z}=$,J;if(typeof z==="number")J=this._$getTemplate($);else{let Z=w0(z.h,z.h[0]);if(z.el===void 0)z.el=$0.createElement(Z,this.options);J=z}if(this._$committedValue?._$template===J)this._$committedValue._update(b);else{let Z=new P0(J,this),q=Z._clone(this.options);Z._update(b),this._commitNode(q),this._$committedValue=Z}}_$getTemplate($){let b=N0.get($.strings);if(b===void 0)N0.set($.strings,b=new $0($));return b}_commitIterable($){if(!G0(this._$committedValue))this._$committedValue=[],this._$clear();let b=this._$committedValue,z=0,J;for(let Z of $){if(z===b.length)b.push(J=new p(this._insert(c()),this._insert(c()),this,this.options));else J=b[z];J._$setValue(Z),z++}if(z<b.length)this._$clear(J&&J._$endNode&&J._$endNode.nextSibling,z),b.length=z}_$clear($=this._$startNode.nextSibling,b){this._$notifyConnectionChanged?.(!1,!0,b);while($&&$!==this._$endNode){let z=$.nextSibling;$.remove(),$=z}}setConnected($){if(this._$parent===void 0)this.__isConnected=$,this._$notifyConnectionChanged?.($);else throw new Error("part.setConnected() может быть вызван только для RootPart, возвращенного из render().")}}class i{type=1;element;name;options;strings;_$committedValue=O;_$disconnectableChildren;_sanitizer;_$parent;get tagName(){return this.element.tagName}get _$isConnected(){return this._$parent._$isConnected}constructor($,b,z,J,Z){if(this.element=$,this.name=b,this._$parent=J,this.options=Z,z.length>2||z[0]!==""||z[1]!=="")this._$committedValue=new Array(z.length-1).fill(new String),this.strings=z;else this._$committedValue=O}_$setValue($,b=this,z=0,J){let Z=this.strings,q=!1;if(Z===void 0){if($=u(this,$,b,0),q=!s($)||$!==this._$committedValue&&$!==g,q)this._$committedValue=$}else{let X=$;$=Z[0];let W,G;for(W=0;W<Z.length-1;W++){if(G=u(this,X[z+W],b,W),G===g)G=this._$committedValue[W];if(q||=!s(G)||G!==this._$committedValue[W],G===O)$=O;else if($!==O)$+=(G??"")+Z[W+1];this._$committedValue[W]=G}}if(q&&!J)this._commitValue($)}_commitValue($){if($===O)this.element.removeAttribute(this.name);else{if(this._sanitizer===void 0)this._sanitizer=y(this.element,this.name,"attribute");$=this._sanitizer($??""),this.element.setAttribute(this.name,$)}}}class y0{type=6;_$committedValue=void 0;_$disconnectableChildren=void 0;constructor($,b,z){this.element=$,this._$parent=b,this.options=z}get _$isConnected(){return this._$parent?._$isConnected}_$setValue($){u(this,$)}}var T0=!0,S0,t,E0,b0=($,b,z)=>(J)=>J,s=($)=>$===null||typeof $!="object"&&typeof $!="function",G0,N1=($)=>G0($)||typeof $?.[Symbol.iterator]==="function",N,f0,T1,k,c=()=>k.createComment(""),d,I0,D0,C,U0,Y0,C0,O,g,N0,P,S1=($,b)=>{let z=$.length-1,J=[],Z=b===2?"<svg>":b===3?"<math>":"",q,X=d;for(let G=0;G<z;G++){let M=$[G],A=-1,U="",Y=0,B;while(Y<M.length){if(X.lastIndex=Y,B=X.exec(M),B===null)break;if(Y=X.lastIndex,X===d){if(B[1]==="!--")X=I0;else if(B[1]!==void 0)X=D0;else if(B[2]!==void 0){if(C0.test(B[2]))q=new RegExp(`</${B[2]}`,"g");X=C}else if(B[3]!==void 0)throw new Error("Привязки в именах тегов не поддерживаются. Пожалуйста, используйте статические шаблоны вместо этого.")}else if(X===C)if(B[0]===">")X=q??d,A=-1;else if(B[1]===void 0)A=-2;else A=X.lastIndex-B[2].length,U=B[1],X=B[3]===void 0?C:B[3]==='"'?Y0:U0;else if(X===Y0||X===U0)X=C;else if(X===I0||X===D0)X=d;else X=C,q=void 0}console.assert(A===-1||X===C||X===U0||X===Y0,"unexpected parse state B");let _=X===C&&$[G+1].startsWith("/>")?" ":"";Z+=X===d?M+T1:A>=0?(J.push(U),M.slice(0,A)+"$html$"+M.slice(A))+N+_:M+N+(A===-2?G:_)}let W=Z+($[z]||"<?>")+(b===2?"</svg>":b===3?"</math>":"");return[w0($,W),J]},y,f1=($)=>{if(y!==b0)throw new Error("Попытка перезаписать существующую политику безопасности @metafor/html. setSanitizeDOMValueFactory должен быть вызван не более одного раза.");y=$},B0=($,b,z)=>y($,b,z),M0=($)=>(b,...z)=>({_$htmlType$:$,strings:b,values:z}),I,G2,M2,W0,k0,g0,h=($,b,z={})=>{if(b==null)throw new TypeError(`Контейнер для рендеринга не может быть ${b}`);let J=z?.renderBefore??b,Z=J._$htmlPart$;if(Z===void 0){let q=z?.renderBefore??null;J._$htmlPart$=Z=new p(b.insertBefore(c(),q),q,void 0,z??{})}return Z._$setValue($),Z};var T=K(()=>{S0=globalThis,t=S0.trustedTypes,E0=t?t.createPolicy("meta-html",{createHTML:($)=>$}):void 0,G0=Array.isArray,N=`html$${Math.random().toFixed(9).slice(2)}$`,f0="?"+N,T1=`<${f0}>`,k=S0.document===void 0?{createTreeWalker(){return{}}}:document,d=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I0=/-->/g,D0=/>/g,C=new RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),U0=/'/g,Y0=/"/g,C0=/^(?:script|style|textarea|title)$/i,O=Symbol.for("nothing"),g=Symbol.for("noChange"),N0=new WeakMap,P=k.createTreeWalker(k,129);y=b0,I=M0(1),G2=M0(2),M2=M0(3);W0=class W0 extends i{type=3;_commitValue($){if(this._sanitizer===void 0)this._sanitizer=y(this.element,this.name,"property");if($=this._sanitizer($),this.name==="context"&&$)try{this.element.isConnected?this.element.update($):this.element._updateContext($)}catch(b){let z=this.element.tagName.toLowerCase();throw new Error(`meta-компонент ${z} не создан`)}else if(this.name==="data")this.element._updateCore({data:$});else if(this.name==="core")try{this.element._updateCore($)}catch(b){let{message:z}=b;switch(z){case"this.element._updateCore is not a function":let J=this.element.tagName.toLowerCase();throw new Error(`meta-компонент ${J} не создан`);default:throw b}}else this.element[this.name]=$===O?void 0:$}};k0=class k0 extends i{type=4;_commitValue($){this.element.toggleAttribute(this.name,!!$&&$!==O)}};g0=class g0 extends i{type=5;constructor($,b,z,J,Z){super($,b,z,J,Z);if(this.strings!==void 0)throw new Error(`Элемент \`<${$.localName}>\` имеет слушатель \`@${b}=...\` с `+"некорректным содержимым. Слушатели событий в шаблонах должны иметь ровно "+"одно выражение без окружающего текста.")}_$setValue($,b=this){if($=u(this,$,b,0)??O,$===g)return;let z=this._$committedValue,J=$===O&&z!==O||$.capture!==z.capture||$.once!==z.once||$.passive!==z.passive,Z=$!==O&&(z===O||J);if(J)this.element.removeEventListener(this.name,this,z);if(Z)this.element.addEventListener(this.name,this,$);this._$committedValue=$}handleEvent($){if(typeof this._$committedValue==="function")this._$committedValue.call(this.options?.host??this.element,$);else this._$committedValue.handleEvent($)}};h.setSanitizer=f1;h.createSanitizer=B0;h._testOnlyClearSanitizerFactoryDoNotCallOrElse=()=>y=b0});var h0=($)=>$.strings===void 0;class o{__part=null;__attributeIndex;__directive;_$parent=null;_$disconnectableChildren;constructor($){}get _$isConnected(){return this._$parent._$isConnected}_$initialize($,b,z){this.__part=$,this._$parent=b,this.__attributeIndex=z}_$resolve($,b){return this.update($,b)}render(...$){}update($,b){return this.render(...b)}}var r=($)=>(...b)=>({["_$htmlDirective$"]:$,values:b}),z0;var _0=K(()=>{z0={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6}});function C1($){if(this._$disconnectableChildren!==void 0)Z0(this),this._$parent=$,x0(this);else this._$parent=$}function w1($,b=!1,z=0){let J=this._$committedValue,Z=this._$disconnectableChildren;if(Z===void 0||Z.size===0)return;if(b){if(Array.isArray(J))for(let q=z;q<J.length;q++)n(J[q],!1),Z0(J[q]);else if(J!=null)n(J,!1),Z0(J)}else n(this,$)}var n=($,b)=>{let z=$._$disconnectableChildren;if(z===void 0)return!1;for(let J of z)J._$notifyDirectiveConnectionChanged?.(b,!1),n(J,b);return!0},Z0=($)=>{let b,z;do{if(b=$._$parent,b===void 0)break;if(z=b._$disconnectableChildren,z)z.delete($);$=b}while(z&&z.size===0)},x0=($)=>{for(let b;b=$._$parent;$=b){let z=b._$disconnectableChildren;if(z===void 0)b._$disconnectableChildren=new Set,z=b._$disconnectableChildren;else if(z.has($))break;z.add($),P1(b)}},P1=($)=>{if($.type==z0.CHILD)$._$notifyConnectionChanged=$._$notifyConnectionChanged||w1,$._$reparentDisconnectables=$._$reparentDisconnectables||C1},Q0;var m0=K(()=>{_0();T();Q0=class Q0 extends o{isConnected=!1;_$disconnectableChildren=void 0;_$initialize($,b,z){super._$initialize($,b,z),x0(this),this.isConnected=$._$isConnected??!1}_$notifyDirectiveConnectionChanged($,b=!0){if($!==this.isConnected)if(this.isConnected=$,$)this.reconnected?.();else this.disconnected?.();if(b)n(this,$),Z0(this)}setValue($){if(h0(this.__part))this.__part._$setValue($,this);else{if(T0&&this.__attributeIndex===void 0)throw new Error("Ожидалось, что this.__attributeIndex будет числом");let z=[...this.__part._$committedValue];z[this.__attributeIndex]=$,this.__part._$setValue(z,this)}}disconnected(){}reconnected(){}render(...$){}}});class v0{value=void 0}var a=()=>new v0,A0,u0,p0;var J0=K(()=>{m0();T();A0=new WeakMap;u0=class u0 extends Q0{#z;#$;#Z;render($){return O}update($,[b]){let z=b!==this.#$;if(z&&this.#$!==void 0)this.#b(void 0);if(z||this.#q!==this._element)this.#$=b,this.#Z=$.options?.host,this.#b(this._element=$.element);return O}#b($){if(!this.isConnected)$=void 0;if(typeof this.#$==="function"){let b=this.#Z??globalThis,z=A0.get(b);if(!z)z=new WeakMap,A0.set(b,z);if(z.get(this.#$)!==void 0)this.#$.call(this.#Z,void 0);if(z.set(this.#$,$),$!==void 0)this.#$.call(this.#Z,$)}else if(this.#$)this.#$.value=$}get#q(){return typeof this.#$==="function"?A0.get(this.#Z??globalThis)?.get(this.#$):this.#$?.value}disconnected(){if(this.#q===this._element)this.#b(void 0)}reconnected(){this.#b(this._element)}};p0=r(u0)});var S=($)=>$,l0=()=>document.createComment(""),l=($,b,z)=>{let J=S($._$startNode).parentNode,Z=b===void 0?$._$endNode:b._$startNode;if(z===void 0){let q=S(J).insertBefore(l0(),Z),X=S(J).insertBefore(l0(),Z);z=new p(q,X,$,$.options)}else{let q=S(z._$endNode).nextSibling,X=z._$parent,W=X!==$;if(W){z._$reparentDisconnectables?.($),z._$parent=$;let G;if(z._$notifyConnectionChanged!==void 0&&(G=$._$isConnected)!==X._$isConnected)z._$notifyConnectionChanged(G)}if(q!==Z||W){let G=z._$startNode;while(G!==q){let M=S(G).nextSibling;S(J).insertBefore(G,Z),G=M}}}return z},w=($,b,z=$)=>{return $._$setValue(b,z),$},k1,d0=($,b=k1)=>$._$committedValue=b,s0=($)=>$._$committedValue,q0=($)=>{$._$notifyConnectionChanged?.(!1,!0);let b=$._$startNode,z=S($._$endNode).nextSibling;while(b!==z){let J=S(b).nextSibling;S(b).remove(),b=J}};var c0=K(()=>{T();k1={}});var i0=($,b,z)=>{let J=new Map;for(let Z=b;Z<=z;Z++)J.set($[Z],Z);return J},r0,o0;var n0=K(()=>{_0();c0();T();r0=class r0 extends o{_itemKeys;constructor($){super($);if($.type!==z0.CHILD)throw new Error("repeat() can only be used in text expressions")}_getValuesAndKeys($,b,z){let J;if(z===void 0)z=b;else if(b!==void 0)J=b;let Z=[],q=[],X=0;for(let W of $)Z[X]=J?J(W,X):X,q[X]=z(W,X),X++;return{values:q,keys:Z}}render($,b,z){return this._getValuesAndKeys($,b,z).values}update($,[b,z,J]){let Z=s0($),{values:q,keys:X}=this._getValuesAndKeys(b,z,J);if(!Array.isArray(Z))return this._itemKeys=X,q;let W=this._itemKeys??=[],G=[],M=void 0,A=void 0,U=0,Y=Z.length-1,B=0,_=q.length-1;while(U<=Y&&B<=_)if(Z[U]===null)U++;else if(Z[Y]===null)Y--;else if(W[U]===X[B])G[B]=w(Z[U],q[B]),U++,B++;else if(W[Y]===X[_])G[_]=w(Z[Y],q[_]),Y--,_--;else if(W[U]===X[_])G[_]=w(Z[U],q[_]),l($,G[_+1],Z[U]),U++,_--;else if(W[Y]===X[B])G[B]=w(Z[Y],q[B]),l($,Z[U],Z[Y]),Y--,B++;else{if(M===void 0)M=i0(X,B,_),A=i0(W,U,Y);if(!M.has(W[U]))q0(Z[U]),U++;else if(!M.has(W[Y]))q0(Z[Y]),Y--;else{let Q=A.get(X[B]),V=Q!==void 0?Z[Q]:null;if(V===null){console.log("Создан новый элемент с ключом:",X[B]);let R=l($,Z[U]);w(R,q[B]),G[B]=R}else G[B]=w(V,q[B]),l($,Z[U],V),Z[Q]=null;B++}}while(B<=_){let Q=l($,G[_+1]);w(Q,q[B]),G[B++]=Q}while(U<=Y){let Q=Z[U++];if(Q!==null)q0(Q)}return this._itemKeys=X,d0($,G),g}};o0=r(r0)});var a0={};X0(a0,{log:()=>g1});function g1($,b){let{meta:z,patch:J}=$,Z=40,q=8,X=15,W=String(z.tag).padEnd(40," "),G=String(z.index).padEnd(4," "),M=y1(String(J.op),8),A=String(J.path).padEnd(15," "),U=h1(J.value),Y=Object.hasOwn(J.value,"error");switch(!0){case H0($,"/"):(()=>{let B=[`%c${W}${G}%c | %c${M}%c | %c${A}`,"color: #3498db; font-weight: bold","","color: #e74c3c","","color: #2ecc71"];if(f.collapseAll?console.groupCollapsed(...B):console.group(...B),typeof J.value==="object"&&J.value!==null)console.log(U),K0(b);else console.log(J.value);console.groupEnd()})();break;case H0($,"/context"):(()=>{let B=[`%c${W}${G}%c | %c${M}%c | %c${A}`,`color: #3498db; font-weight: bold; ${Y?"background: #7d4545":""}`,"","color: #e74c3c","","color: #2ecc71"];if(Y)console.group(...B);else if(f.collapseAll)console.groupCollapsed(...B);else console.group(...B);try{if(typeof J.value==="object"&&J.value!==null)console.log(U),K0(b);else console.log(J.value)}finally{console.groupEnd()}})();break;case H0($,"/state"):(()=>{let B=Array.isArray(J.value)?JSON.stringify(J.value,null,2):typeof J.value==="object"&&J.value!==null?JSON.stringify(J.value,null,2):J.value,_=[`%c${W}${G}%c | %c${M}%c | %c${A}%c %c${B}`,"color: #3498db; font-weight: bold","","color: #e74c3c","","color: #2ecc71","","color: lightskyblue; font-weight: bold"];f.collapseAll?console.groupCollapsed(..._):console.group(..._);try{K0(b)}finally{console.groupEnd()}})();break}}var f,H0=({meta:$,patch:b},z)=>Boolean(f.active&&b.path===z&&f.path.includes(z)&&(!f.tag.length||f.tag.includes($.tag))&&(f.index===null||$.index===f.index)),y1=($,b)=>{let z=Math.floor((b-$.length)/2);return $.padStart(z+$.length," ").padEnd(b," ")},h1=($)=>JSON.stringify($,null,2).split(`
`).map((b,z,J)=>{if(z===0||z===J.length-1)return b;return`${b}`}).join(`
`),K0=($)=>{console.log("snapshot core: ",{...$}),console.log("current  core: ",$)};var e0=K(()=>{f={active:!0,collapseAll:!0,tag:[],index:null,patch:["add","remove","replace","move","copy","test"],path:["/","/context","/state"]}});function x1($,b){if(!b||typeof b!=="object"||!("type"in b))throw new Error(`Поле "${$}" в контексте должно иметь объявленный тип`);let z=["string","number","boolean","enum","array"];if(!z.includes(b.type))throw new Error(`Неподдерживаемый тип "${b.type}" для поля "${$}". `+`Поддерживаемые типы: ${z.join(", ")}`);if(b.type==="enum"){if(!b.values||!Array.isArray(b.values)||b.values.length===0)throw new Error(`Enum поле "${$}" должно иметь непустой массив значений`)}}function t0($){if(!$||typeof $!=="object")throw new Error("Контекст должен быть объектом");Object.entries($).forEach(([b,z])=>x1(b,z))}var $1=($)=>{if(typeof $!=="function")console.error("Ядро должно быть функцией")};function m1({fromState:$,toState:b,forwardConditions:z,backwardConditions:J}){let Z=Object.keys(z).filter((q)=>(q in J));for(let q of Z){let X=z[q],W=J[q];if(X===null&&W!==null||W===null&&X!==null)continue;if(X===null&&W===null)continue;if(X&&W&&typeof X==="object"&&typeof W==="object")if("gt"in X||"gte"in X||"lt"in X||"lte"in X){let G={min:X.gt??X.gte??-1/0,max:X.lt??X.lte??1/0},M={min:W.gt??W.gte??-1/0,max:W.lt??W.lte??1/0};if(!(G.max<M.min||M.max<G.min))throw new Error("Обнаружена потенциальная циклическая зависимость в meta между состояниями "+`${$} и ${b}.
Условия переходов для поля "${q}":
${$} -> ${b}: ${JSON.stringify(X)}
${b} -> ${$}: ${JSON.stringify(W)}
`+`Диапазоны:
`+`${$} -> ${b}: (${G.min}, ${G.max})
${b} -> ${$}: (${M.min}, ${M.max})
`+"Условия должны иметь непересекающиеся диапазоны значений")}else if(X.isNull===!1&&W===null);else if(X===null&&W.isNull===!1);else throw new Error("Обнаружена потенциальная циклическая зависимость в meta между состояниями "+`${$} и ${b}.
Условия переходов для поля "${q}":
${$} -> ${b}: ${JSON.stringify(X)}
${b} -> ${$}: ${JSON.stringify(W)}
`+"Условия противоречат друг другу");else if(X!==W)continue}}function b1({transitions:$}){let b=new Map;$.forEach((J)=>{if(!b.has(J.in))b.set(J.in,[]);Object.entries(J.to).forEach(([Z,q])=>{b.get(J.in)?.push({state:Z,conditions:q||{}})})});function z(J,Z=new Set,q=[]){if(Z.has(J)){let W=q.findIndex((M)=>M.state===J),G=q.slice(W);for(let M=0;M<G.length;M++){let A=G[M],U=G[(M+1)%G.length],B=(b.get(A.state)||[]).find((V)=>V.state===U.state),Q=(b.get(U.state)||[]).find((V)=>V.state===A.state);if(B&&Q)m1({fromState:A.state,toState:U.state,forwardConditions:B.conditions,backwardConditions:Q.conditions})}return}Z.add(J);let X=b.get(J)||[];for(let W of X)z(W.state,Z,[...q,{state:J,conditions:W.conditions}]);Z.delete(J)}for(let J of b.keys())z(J)}function z1({tag:$,transitions:b,contextDefinition:z}){b.forEach((J,Z)=>{Object.entries(J.to).forEach(([q,X])=>{if(!X)return;if(Object.keys(X).length===0)throw new Error(`Пустой триггер в переходе из состояния "${J.in}" в "${q}". Триггер должен содержать хотя бы одно условие.`);Object.entries(X).forEach(([W,G])=>{let M=z[W];if(!M)throw new Error(`Поле "${W}" не найдено в определении контекста для триггера ${J.in}`);if(v1(W,M,G),typeof G==="object"&&G!==null){let A=Object.keys(G);if(A.length===0)throw new Error(`Пустое условие в триггере /${J.in}/${W}/trigger`);let U=E[M.type],Y=A.filter((B)=>!U.has(B));if(Y.length>0)throw new Error(`Недопустимые ключи условия [${Y.join(", ")}] для типа "${M.type}" в триггере /${J.in}/${W}/trigger. Допустимые ключи: ${Array.from(U).join(", ")}`)}})})})}function x($,b){if(b==="array")return Array.isArray($);if(b==="object")return typeof $==="object"&&$!==null&&!Array.isArray($);return typeof $===b}function v1($,b,z){let Z={string:u1,number:p1,boolean:l1,enum:s1,array:d1}[b.type];if(Z){if(z===null&&!b.nullable)throw new Error(`Поле "${$}", в переходе, не может быть null, так как оно не является nullable.`);Z($,z,b)}else throw new Error(`Неизвестный тип поля "${b.type}" в триггере ${$}`)}function u1($,b,z){if(b===null){if(!z.nullable)throw new Error(`Поле "${$}" не может быть null, так как оно не является nullable`);return}if(typeof b==="string"||b instanceof RegExp)return;if(x(b,"object")){let J=E.string;if(Object.keys(b).some((X)=>J.has(X)))return}throw new Error(`Некорректный триггер для строкового поля "${$}". Ожидается строка, регулярное выражение или объект с ключами ${Array.from(E.string).map((J)=>`"${J}"`).join(", ")}. Получено: ${JSON.stringify(b)}`)}function p1($,b,z){if(b===null&&z.nullable)return;if(x(b,"number"))return;if(x(b,"object")){let J=E.number;if(Object.keys(b).some((X)=>J.has(X)))return}throw new Error(`Некорректный триггер для числового поля "${$}". Ожидается число или объект с ключами ${Array.from(E.number).map((J)=>`"${J}"`).join(", ")}. Получено: ${JSON.stringify(b)}`)}function l1($,b,z){if(b===null){if(!z.nullable)throw new Error(`Поле "${$}" не может быть null, так как оно не является nullable`);return}if(x(b,"boolean"))return;if(x(b,"object")){let J=E.boolean;if(Object.keys(b).some((X)=>J.has(X)))return}throw new Error(`Некорректный триггер для булевого поля "${$}". Ожидается булево значение или объект с ключами ${Array.from(E.boolean).map((J)=>`"${J}"`).join(", ")}. Получено: ${JSON.stringify(b)}`)}function d1($,b){if(b===null)return;if(Array.isArray(b))return;if(x(b,"object")){let z=E.array;if(Object.keys(b).some((q)=>z.has(q))){if(b.length){if(typeof b.length==="object"&&b.length!==null){let q=Object.keys(b.length),X=["eq","gt","lt"];if(!q.some((G)=>X.includes(G)))throw new Error(`Некорректный формат length для поля массива "${$}". Ожидается объект с ключами ${X.join(", ")}. Получено: ${JSON.stringify(b.length)}`)}else if(typeof b.length!=="number")throw new Error(`Некорректный формат length для поля массива "${$}". Ожидается число или объект с ключами eq, gt, lt. Получено: ${JSON.stringify(b.length)}`)}return}}throw new Error(`Некорректный триггер для поля массива "${$}". Ожидается массив или объект с ключами ${Array.from(E.array).map((z)=>`"${z}"`).join(", ")}. Получено: ${JSON.stringify(b)}`)}function s1($,b,z){if(b===null){if(!z.nullable)throw new Error(`Поле "${$}" не может быть null, так как оно не является nullable`);return}let{values:J}=z;if(typeof b==="string"||typeof b==="number"){if(!J?.includes(b))throw new Error(`Значение "${b}" не является допустимым для enum поля "${$}". Допустимые значения: [${J.join(", ")}].`);return}if(x(b,"object")){let Z=E.enum;if(Object.keys(b).some((W)=>Z.has(W)))return}throw new Error(`Некорректный триггер для enum поля "${$}". Ожидается строка, число или объект с ключами ${Array.from(E.enum).map((Z)=>`"${Z}"`).join(", ")}. Получено: ${JSON.stringify(b)}`)}var E;var Z1=K(()=>{E={string:new Set(["startsWith","endsWith","include","pattern","not","eq","notEq","notInclude","notStartsWith","notEndsWith","isNull","between","length"]),number:new Set(["isNull","eq","gt","gte","lt","lte","notEq","notGt","notGte","notLt","notLte","between"]),boolean:new Set(["eq","notEq","isNull","logicalEq","notNull"]),enum:new Set(["isNull","eq","notEq","oneOf","notOneOf"]),array:new Set(["isNull","length","includes","notIncludes","every","some","isEmpty","isNotEmpty"])}});function J1({id:$,states:b}){if(!Array.isArray(b))throw new Error("Состояния должны быть массивом строк");b.forEach((z,J)=>{if(!z||typeof z!=="string"||z.trim()==="")throw new Error(`Состояние с индексом ${J} имеет пустое имя. Все состояния должны иметь непустые строковые имена`)})}var m={};X0(m,{validateTransitions:()=>r1,validateStates:()=>a1,validateCreateOptions:()=>n1,validateCore:()=>o1,validateContextDefinition:()=>i1});function D($){e.postMessage({...$,type:"error"})}function c1($){e.postMessage({...$,type:"warning"})}function i1({tag:$,context:b}){try{t0(b)}catch(z){let{message:J}=z;e.postMessage({id:$,message:J})}}function r1({tag:$,transitions:b,contextDefinition:z}){if(!Array.isArray(b)){D({id:$,message:`Transitions должен быть массивом, получено: ${typeof b}`,src:"transitions"});return}if(b.length===0){c1({id:$,message:"Переходы отсутствуют. Мета не будет менять состояние.",src:"transitions"});return}b.forEach((J,Z)=>{if(!J.in)D({id:$,message:`Отсутствует обязательное поле 'in' в transitions[${Z}]`,src:"transitions"});if(!J.to)D({id:$,message:`Отсутствует обязательное поле 'to' в transitions[${Z}]`,src:"transitions"});else if(typeof J.to!=="object"||Array.isArray(J.to))D({id:$,message:`Поле 'to' должно быть объектом в transitions[${Z}]`,src:"transitions"});else Object.entries(J.to).forEach(([q,X],W)=>{if(!q)D({id:$,message:`Отсутствует состояние в transitions[${Z}].to[${W}]`,src:"transitions"});if(!X||typeof X!=="object")D({id:$,message:`Отсутствуют условия для состояния '${q}' в transitions[${Z}].to[${W}]`,src:"transitions"})})}),b1({transitions:b});try{z1({tag:$,transitions:b,contextDefinition:z})}catch(J){let{message:Z}=J;D({id:$,message:Z,src:"triggers"})}}function o1({tag:$,core:b}){try{$1(b)}catch(z){let{message:J}=z;D({id:$,message:J,src:"core"})}}function n1({tag:$,states:b}){try{}catch(z){let{message:J}=z;D({id:$,message:J,src:"create"})}}function a1({tag:$,states:b}){try{J1({id:$,states:b})}catch(z){let{message:J}=z;D({id:$,message:J,src:"states"})}}var e;var v=K(()=>{Z1();e=new BroadcastChannel("validator");e.onmessage=({data:$})=>{if($.destroy)setTimeout(()=>{e.close()},1000)}});function t1({development:$,description:b="",tag:z,states:J,initialState:Z,contextDefinition:q,transitions:X,coreDefinition:W,reactions:G={},view:M}){$&&Promise.resolve().then(() => (v(),m)).then((U)=>U.validateCreateOptions({tag:z,states:J}));let A=0;return customElements.define("metafor-"+z,class extends HTMLElement{index=0;#z=this.attachShadow({mode:"closed"});#$=void 0;#Z=!1;context=Object.keys(q).reduce((U,Y)=>{let B="default"in q[Y]?q[Y].default:void 0;if(typeof B!=="undefined")return{...U,[Y]:B};else return{...U,[Y]:"nullable"in q[Y]?null:void 0}},{});#b=(()=>{let U=null,Y={},B=W({element:this,update:(Q)=>this._update({ctx:Q,srcName:"core",funcName:U||"unknown"}),context:this.context,self:Y});Object.entries(B).forEach(([Q,V])=>{if(typeof V!=="function")Object.defineProperty(Y,Q,{get:()=>B[Q],set:(R)=>B[Q]=R,enumerable:!0,configurable:!0});else Y[Q]=V});let _=Object.entries(B).reduce((Q,[V,R])=>{if(typeof R==="function")Q[V]=(...L)=>{U=V;let I1=R.apply(B,L);return U=null,I1};else Object.defineProperty(Q,V,{get:()=>B[V],set:(L)=>B[V]=L,enumerable:!0,configurable:!0});return Q},{});return Object.assign(Y,_),_})();#q={};#K=J;#X=((U)=>{let Y=new Set;return{setValue:(B)=>{if(U!==B){let _=U;U=B,Y.forEach((Q)=>Q(_,B)),this.setAttribute("state",this.state),this.#U(B)}},value:()=>U,onChange:(B)=>{return Y.add(B),()=>{Y.delete(B)}},clear:()=>Y.clear()}})(Z);get state(){return this.#X?.value()}get process(){return this.#Z}set process(U){if(this.#Z=U,!U)this.removeAttribute("process"),this.#U(this.state),this.update(this.context);else this.setAttribute("process","")}constructor(){super();this.setAttribute("state",Z),M.style?.({css:(U,...Y)=>{let B=new CSSStyleSheet,_=U.reduce((Q,V,R)=>Q+V+(Y[R]||""),"");return B.replaceSync(_),this.#z.adoptedStyleSheets.push(B),B}})}connectedCallback(){if(!this.index)this.index=A+=1;if(this.#$=new BroadcastChannel("channel"),Object.keys(G).length)this.#$.onmessage=({data:Y})=>this.#H(Y),this.addEventListener("channel",this.#A);this.#W({path:"/",op:"add",value:this.snapshot()});let U=X.find((Y)=>Y.in===Z);if(U?.action)this.process=!0,this.#U(Z),this.#_(U),this.#B();else this.#U(Z),this.#B();if(M)this.#J(),M.onMount?.({update:(Y)=>this._update({ctx:Y,srcName:"view",funcName:"onMount"}),component:this.#z.host,core:this.#b,context:this.context})}#J=()=>{if(!M?.render)return;h(M.render({update:(U)=>this._update({ctx:U,srcName:"component",funcName:"handler"}),context:this.context,state:this.state,core:this.#b,html:I,ref:p0,repeat:o0}),this.#z)};disconnectedCallback(){if(this.#W({op:"remove",path:"/",value:null}),this.#$)this.#$.onmessage=null,this.#$.close(),this.#$=void 0;this.#z.adoptedStyleSheets=[],this.#b=void 0,M?.onDestroy?.({component:this.#z.host,core:this.#b}),this.#z.removeEventListener("channel",this.#A)}_updateCore(U){Object.keys(U).forEach((Y)=>{if(Y in this.#b)this.#b[Y]=U[Y]})}update=(U)=>{let Y=this.#G({ctx:U});this.#M(Y)};_update=({ctx:U,srcName:Y="core",funcName:B="unknown"})=>{let _=this.#G({ctx:U,srcName:Y,funcName:B});this.#M(_)};#G=({ctx:U,srcName:Y="unknown",funcName:B="unknown"})=>{let _=this._updateContext(U);if(Object.keys(_).length>0)this.#Y.forEach((Q)=>Q(_,Y,B)),this.#W({path:"/context",op:"replace",value:_});return _};#M=(U)=>{if(this.process){if(M?.render&&Object.keys(U).length)this.#J();return}let Y=this.state;if(this.#B(),M?.render&&Object.keys(U).length&&Y===this.state)this.#J()};_updateContext=(U)=>{return Object.keys(U).reduce((Y,B)=>{if(!(B in this.context))return console.warn(`${z}: ${String(B)} отсутствует в контексте!`,this.context),Y;if(this.context[B]!==U[B])return this.context[B]=U[B],{...Y,[B]:U[B]};return Y},{})};#Y=new Set;onUpdate=(U)=>{return this.#Y.add(U),()=>{this.#Y.delete(U)}};#_=(U)=>{let{action:Y,success:B,error:_}=U;if(!Y)return;let Q,V={context:this.context,element:this,core:this.#b},R=(L)=>this._update({ctx:L,srcName:"action",funcName:"unknown"});try{if(Q=Y(V),Q&&typeof Q.then==="function")Q.then((L)=>{if(typeof B==="function")B({...V,data:L,update:R});else if(L&&typeof L==="object"&&!(L instanceof Error))R(L)}).catch((L)=>{if(typeof _==="function")_({...V,data:L,update:R});else if(L instanceof Error)R({error:L.message})}).finally(()=>this.process=!1);else{if(typeof B==="function")B({...V,data:Q,update:R});else if(Q&&typeof Q==="object"&&!(Q instanceof Error))R(Q);this.process=!1}}catch(L){if(typeof _==="function")_({...V,data:L,update:R});else if(L instanceof Error)R({error:L.message});this.process=!1}};#B=()=>{let U=X.find((Y)=>Y.in===this.state);if(U)for(let[Y,B]of Object.entries(U.to)){if(Object.keys(B).length===0)break;if($2(B,this.context,q)){let _=X.find((Q)=>Q.in===Y&&Q.action);if(_?.action){if(this.process=!0,this.#X.setValue(Y),M.render)this.#J();this.#_(_)}else if(this.#X.setValue(Y),M.render)this.#J();break}}};onTransition=(U)=>this.#X.onChange((Y,B)=>{if(B!==void 0)U(Y,B)});snapshot=()=>{return{id:this.id,description:b,state:this.state,states:this.#K,core:this.#q,context:this.context,types:q,transitions:X.map((U)=>({in:U.in,to:Object.entries(U.to).map(([Y,B])=>({state:Y,when:B}))}))}};get#Q(){return{tag:z,index:this.index,timestamp:Date.now()}}#U=(U)=>{let Y={meta:this.#Q,patch:{path:"/state",op:this.process?"add":"replace",value:U}};if(!this.#$){console.warn("Нет канала!",Y);return}if(this.#$.postMessage(Y),O0)L0(Y,this.#b)};#W=(U)=>{let Y={meta:this.#Q,patch:U};if(this.#z.dispatchEvent(new CustomEvent("channel",{detail:Y,bubbles:!0,cancelable:!1,composed:!0})),O0)L0(Y,this.#b)};#A=(U)=>{let{meta:Y,patch:B}=U.detail;if(Y.tag===z&&Y.index===this.index)return;this.#H({meta:Y,patch:B},U)};get id(){return`${z}/${this.index}`}#H=({meta:U,patch:Y},B)=>Object.values(G).forEach((_)=>{if(_.filter({meta:U,patch:Y,context:this.context})){if(_.action({id:this.id,patch:Y,meta:U,context:this.context,core:this.#b,update:(Q)=>this._update({ctx:Q,srcName:"reaction",funcName:"unknown"})}),!B)return;if(_.block)B.preventDefault(),B.stopPropagation()}})}),document.querySelector("metafor-"+z)}function $2($,b,z){for(let J in $){let Z=$[J],q=b[J],X=z[J],W=X?.type;if(Z===null){if("nullable"in X&&!X.nullable)return!1;if(q!==null)return!1;continue}if(typeof Z==="object"&&"isNull"in Z){let G=Z.isNull,M=q===null||q===void 0;if(!G&&M)return!1;if(G&&!M)return!1;if(G)continue}if(q===null||q===void 0)return!1;if(typeof Z!=="object"){if(q!==Z)return!1;continue}switch(W){case"string":if(typeof q!=="string")return!1;if("include"in Z&&Z.include&&!q.includes(Z.include))return!1;if("startsWith"in Z&&Z.startsWith&&!q.startsWith(Z.startsWith))return!1;if("endsWith"in Z&&Z.endsWith&&!q.endsWith(Z.endsWith))return!1;if("notEndsWith"in Z&&Z.notEndsWith&&q.endsWith(Z.notEndsWith))return!1;continue;case"number":if("eq"in Z&&q!==Z.eq)return!1;if("gt"in Z&&Z.gt!==void 0&&Z.gt!==null&&Number(q)<=Number(Z.gt))return!1;if("gte"in Z&&Z.gte!==void 0&&Z.gte!==null&&Number(q)<Number(Z.gte))return!1;if("lt"in Z&&Z.lt!==void 0&&Z.lt!==null&&Number(q)>=Number(Z.lt))return!1;if("lte"in Z&&Z.lte!==void 0&&Z.lte!==null&&Number(q)>Number(Z.lte))return!1;if("between"in Z&&Array.isArray(Z.between)){let[G,M]=Z.between;if(q<G||q>M)return!1}continue;case"boolean":if("eq"in Z&&q!==Z.eq)return!1;if("notEq"in Z&&q===Z.notEq)return!1;if("logicalEq"in Z&&Boolean(q)!==Boolean(Z.logicalEq))return!1;continue;case"enum":if("eq"in Z&&q!==Z.eq)return!1;if("notEq"in Z&&q===Z.notEq)return!1;if("oneOf"in Z&&Array.isArray(Z.oneOf)&&!Z.oneOf.includes(q))return!1;if("notOneOf"in Z&&Array.isArray(Z.notOneOf)&&Z.notOneOf.includes(q))return!1;continue;case"array":if(!Array.isArray(q))return!1;if("length"in Z){if(typeof Z.length==="number"&&q.length!==Z.length)return!1;if(typeof Z.length==="object"){if("min"in Z.length&&q.length<Z.length.min)return!1;if("max"in Z.length&&q.length>Z.length.max)return!1}}if("includes"in Z&&!q.includes(Z.includes))return!1;if("notIncludes"in Z&&q.includes(Z.notIncludes))return!1;if("isEmpty"in Z&&Z.isEmpty!==(q.length===0))return!1;continue;default:return!1}}return!0}var O0,L0=($,b)=>{return},V0=void 0,e1=($)=>{if(V0)return;V0=$,V0.onmessage=({data:b})=>console.warn(`${b.id}: ${b.message}`),console.debug("Режим разработки активирован")},H=($,b={})=>{let{development:z,description:J}=b;if(z)Promise.resolve().then(() => v()),e1(new BroadcastChannel("validator"));return{context(Z){let q=Z({string:(X={})=>({type:"string",...X}),number:(X={})=>({type:"number",...X}),boolean:(X={})=>({type:"boolean",...X}),array:(X={})=>({type:"array",default:X.default??[],elementType:X.default&&X.default.length>0?typeof X.default[0]==="string"?"string":typeof X.default[0]==="number"?"number":typeof X.default[0]==="boolean"?"boolean":"string":"string",...X}),enum:(...X)=>(W={})=>({type:"enum",values:X,...W})});return z&&Promise.resolve().then(() => (v(),m)).then((X)=>X.validateContextDefinition({tag:$,context:q})),{core(X){let W=X||(()=>Object.create({}));return z&&Promise.resolve().then(() => (v(),m)).then((G)=>G.validateCore({tag:$,core:W})),{reactions:(G)=>({states(...M){return z&&Promise.resolve().then(() => (v(),m)).then((A)=>A.validateStates({tag:$,states:M})),{transitions(A,U){if(z){let Y={tag:$,transitions:[...U],contextDefinition:q};Promise.resolve().then(() => (v(),m)).then((B)=>B.validateTransitions(Y))}return{view:(Y)=>t1({states:M,initialState:A,contextDefinition:q,view:Y,transitions:U,development:z,description:J,tag:$,coreDefinition:W,reactions:G})}}}}})}}}}}};var F=K(async()=>{T();J0();n0();O0=localStorage.getItem("debug")==="true";if(O0)L0=(await Promise.resolve().then(() => (e0(),a0))).log});function b2($,b,z){return Object.entries($).filter(([J,Z])=>Z.state===b&&Z.parent==="state").map(([J,Z])=>({id:J,x:Z.x-z.x,y:Z.y-z.y,width:Z.size??12,height:Z.size??12}))}function z2($,b,z){return Object.entries($).filter(([J,Z])=>Z.state===b&&Z.parent==="condition").map(([J,Z])=>({id:J,layoutOptions:Z.direction==="west"?z.port.west:z.port.east,width:Z.size/2,height:Z.size/2}))}function Z2($,b,z,J){return{layoutOptions:J.state,id:$,width:b.width,height:b.height,ports:b2(z,b.state,{x:b.x||0,y:b.y||0})}}function J2($,b,z,J){return Object.entries($).filter(([Z,q])=>q.to===b).map(([Z,q])=>({layoutOptions:J.condition,id:Z,width:q.width,height:q.height,ports:z2(z,b,J)}))}function q2($,b){return Object.entries($).filter(([z,J])=>J.state===b&&J.parent==="condition"&&J.direction==="east").map(([z,J])=>{let Z=Object.entries($).find(([q,X])=>X.state===b&&X.param===J.param&&X.parent==="state"&&X.direction==="west");if(typeof Z==="undefined")return;return{id:`${z}->${Z[0]}`,sources:[z],targets:[Z[0]]}}).filter((z)=>z!==void 0)}function X2($){return Object.entries($).filter(([b,z])=>z.parent==="state"&&z.direction==="east").map(([b,z])=>{let J=Object.entries($).find(([Z,q])=>q.param===z.param&&q.state!==z.state&&q.parent==="condition"&&q.direction==="west");if(typeof J==="undefined")return;return{id:`${b}->${J[0]}`,sources:[b],targets:[J[0]]}}).filter((b)=>b!==void 0)}function U2($,b,z,J){return{layoutOptions:J.meta,id:b.state,children:[...J2(z.conditions,b.state,z.sockets,J),Z2($,b,z.sockets,J)],edges:q2(z.sockets,b.state)}}function q1($,b,z){return{id:$,layoutOptions:z.base,children:Object.entries(b.states).map(([J,Z])=>U2(J,Z,b,z)),edges:X2(b.sockets)}}import Y2 from"elkjs";var r2;var X1=K(async()=>{await F();r2=H("graph-layout",{development:!0}).context(($)=>({current:$.string({title:"ID ноды meta передающий данные",nullable:!0}),ready:$.string({title:"ID готовой ноды meta",nullable:!0}),data:$.boolean({title:"Статус получения данных элементов от nodes-meta",default:!1}),metrics:$.boolean({title:"Статус получения размеров и позиций от нодовых эл-ов",default:!1}),error:$.string({nullable:!0})})).core(()=>({elk:new Y2,meta:new Map,data:null,count:0,config:{base:{"elk.layered.spacing.edgeEdgeBetweenLayers":20,"elk.spacing.edgeEdge":20,"elk.spacing.edgeNode":20,hierarchyHandling:"INCLUDE_CHILDREN","elk.layered.layering.strategy":"LONGEST_PATH_SOURCE","elk.padding":"[top=20.0, left=20.0, bottom=20.0, right=20.0]","considerModelOrder.strategy":"PREFER_NODES","elk.port.size":12},meta:{"elk.padding":"[top=0.0, left=0.0, bottom=0.0, right=0.0]","elk.layered.nodePlacement.strategy":"NETWORK_SIMPLEX"},state:{portConstraints:"FIXED_POS"},condition:{},operator:{portConstraints:"FIXED_SIDE","portAlignment.west":"JUSTIFIED","portAlignment.east":"JUSTIFIED"},port:{west:{"port.side":"WEST"},east:{"port.side":"EAST"}}}})).reactions({"начало создания актора":{filter:({patch:$,meta:b})=>b.tag==="graph-listener"&&$.path==="/context"&&$.op==="replace"&&Object.hasOwn($.value,"nodes")&&$.value.nodes.length,action({patch:$,update:b}){let z=$.value.nodes[$.value.nodes.length-1];b({current:z})}},"элементы":{filter:({patch:$,meta:b,context:z})=>Boolean(z.current&&b.tag.includes("graph-")&&$.path==="/"&&$.op==="add"&&["graph-context","graph-condition","graph-socket","graph-param"].includes(b.tag)),action({meta:$,patch:b,update:z,core:J}){let Z=J.meta.get(b.value.context.id);if(!Z){z({error:`При получении элементов, в карте данных, отсутствует мета: ${b.value.context.id}`}),console.error($,b);return}if($.tag==="graph-context")Z.states[b.value.id]={state:b.value.context.state};else if($.tag==="graph-condition")Z.conditions[b.value.id]={from:b.value.context.from,param:b.value.context.param,to:b.value.context.to};else if($.tag==="graph-socket")Z.sockets[b.value.id]={state:b.value.context.state,parent:b.value.context.parent,direction:b.value.context.direction,param:b.value.context.param};else if($.tag==="graph-param")Z.params[b.value.id]={state:b.value.context.state,param:b.value.context.param};else return;J.count=J.count+1}},"размеры":{filter:({patch:$,meta:b,context:z})=>Boolean(z.current&&b.tag.includes("graph-")&&$.path==="/context"&&$.op==="replace"&&(Object.hasOwn($.value,"x")||Object.hasOwn($.value,"y")||Object.hasOwn($.value,"width")||Object.hasOwn($.value,"height"))&&["graph-context","graph-condition","graph-socket","graph-param"].includes(b.tag)),action({meta:$,patch:b,core:z,update:J,context:Z}){let q=z.meta.get(Z.current);if(!q){J({error:`При получении размеров в карте данных, отсутствует мета: ${Z.current}`}),console.error($,b);return}let X=`${$.tag}/${$.index}`;if($.tag==="graph-context")q.states[X].width=b.value.width,q.states[X].height=b.value.height,q.states[X].x=b.value.x,q.states[X].y=b.value.y;else if($.tag==="graph-condition")q.conditions[X].width=b.value.width,q.conditions[X].height=b.value.height;else if($.tag==="graph-socket")q.sockets[X].size=b.value.size,q.sockets[X].x=b.value.x,q.sockets[X].y=b.value.y;else if($.tag==="graph-param")q.params[X].width=b.value.width,q.params[X].height=b.value.height,q.params[X].x=b.value.x,q.params[X].y=b.value.y;if(z.count=z.count-1,!z.count)J({metrics:!0})}},"конец создания мета":{filter:({patch:$,meta:b,context:z})=>Boolean(z.current&&b.tag==="graph-listener"&&$.path==="/context"&&$.op==="replace"&&Object.hasOwn($.value,"nodes")&&!$.value.nodes.length),action({update:$}){$({data:!0})}}}).states("ожидание","получение данных","форматирование данных","вычисление").transitions("ожидание",[{in:"ожидание",to:{"получение данных":{current:{isNull:!1}}}},{in:"получение данных",action({context:$,core:b}){if(!$.current)throw new Error("Нет ID мета для обработки данных");if(!b.meta.get($.current))b.meta.set($.current,{states:{},conditions:{},sockets:{},params:{}})},to:{"форматирование данных":{data:!0,metrics:!0}}},{in:"форматирование данных",action({core:$,context:b}){let z=$.meta.get(b.current);if(!z)return;return $.data=q1(b.current,z,$.config),console.log($.data),{current:null}},to:{"вычисление":{current:{isNull:!0}}}},{in:"вычисление",action:async({core:$})=>{if($.data){console.log($.data);let b=await $.elk.layout($.data);sessionStorage.setItem($.data.id,JSON.stringify(b))}else throw new Error("Отсутствуют данные для layout")},to:{"ожидание":{current:null}}}]).view({render:({html:$})=>$`
      <slot></slot>
    `,style:({css:$})=>$`
      :host {
        width: 100vw;
        height: 100vh;
      }
    `})});var U1=($,b)=>{return I`
    <metafor-graph-meta context=${{id:$.id,description:$.description}}>
      ${$.states.map((z)=>I`
        <metafor-graph-state core=${{meta:b}} context=${{id:$.id,state:z}}>
          ${$.transitions.map((J)=>{return J.to.filter((q)=>q.state===z).map((q)=>Object.entries(q.when).map(([X,W])=>{let G,M;if(typeof W==="object"&&W!==null)return I`
                    <metafor-graph-condition context=${{id:$.id,from:J.in,to:q.state,param:X,type:$.types[X].type}}> ${I`${Object.entries(([A,U])=>I`
                      <metafor-graph-operator context=${{id:$.id,from:J.in,to:q.state,op:A,value:U}}>
                      </metafor-graph-operator>`)}
                    </metafor-graph-condition>`}`;else if(W===null)G="isNull",W=!0;else G="eq",M=W;return I`
                  <metafor-graph-condition context=${{id:$.id,from:J.in,to:q.state,param:X,type:$.types[X].type}}
                  >
                    <metafor-graph-operator context=${{id:$.id,from:J.in,to:q.state,op:G,value:M}}>
                    </metafor-graph-operator>
                  </metafor-graph-condition>
                `}))})}
          <metafor-graph-context .core=${{meta:b}} context=${{id:$.id,state:z}}>
            ${Object.keys($.types).map((J)=>I`
              <metafor-graph-param
                .core=${{meta:b}}
                context=${{id:$.id,state:z,param:J,title:$.types[J].title,value:$.context[J],options:$.types[J].type==="enum"?$.types[J].values:[],type:$.types[J].type}}
              ></metafor-graph-param>
            `)}
          </metafor-graph-context>
        </metafor-graph-state>
      `)}
    </metafor-graph-meta>
  `};var Y1=K(()=>{T()});var b3;var B1=K(async()=>{await F();T();Y1();b3=H("graph-listener",{description:"Отслеживает добавление и удаление акторов",development:!0}).context(($)=>({op:$.enum("add")({title:"Тип патча",nullable:!0}),nodes:$.array({title:"Коллекция meta"}),error:$.string({title:"Ошибка",nullable:!0})})).core(({self:$,context:b,update:z})=>{return document.addEventListener("channel",(J)=>{let{detail:Z}=J,{meta:q,patch:X}=Z;if(X.op==="add"&&!q.tag.includes("graph-")&&!q.tag.includes("input-"))$.snapshot=X.value,$.instance=J.target,z({op:"add",nodes:[...b.nodes,X.value.id]})}),{snapshot:null,instance:null}}).reactions({}).states("ожидание патча","добавление актора").transitions("ожидание патча",[{in:"ожидание патча",to:{"добавление актора":{op:"add"}}},{in:"добавление актора",action:({element:$,core:b,context:z})=>{if(!b.snapshot)throw new Error(`Отсутствует снимок meta - ${z.nodes[z.nodes.length]}`);let J=b.snapshot;return h(U1(J,b.instance),$),b.snapshot=null,{nodes:z.nodes.slice(1)}},to:{"ожидание патча":{nodes:{isEmpty:!0}},"добавление актора":{nodes:{isEmpty:!1}}}}]).view({render:({html:$})=>$`
      <slot></slot>`})});function G1($,b,z=8){if(b.length<2)return;$.beginPath(),$.moveTo(b[0].x,b[0].y);for(let Z=1;Z<b.length-1;Z++){let q=b[Z-1],X=b[Z],W=b[Z+1];if(q.y===X.y)$.lineTo(X.x-Math.sign(X.x-q.x)*z,X.y),$.quadraticCurveTo(X.x,X.y,X.x,X.y+Math.sign(W.y-X.y)*z);else $.lineTo(X.x,X.y-Math.sign(X.y-q.y)*z),$.quadraticCurveTo(X.x,X.y,X.x+Math.sign(W.x-X.x)*z,X.y)}let J=b[b.length-1];$.lineTo(J.x,J.y)}var W1=($)=>{let b=($.edges||[]).map((J)=>{return J}),z=($.children||[]).flatMap((J)=>{return(J.edges||[]).map((Z)=>{let[q]=Z.sections||[];if(!q)return;let X=[R0(q.startPoint,J),...(q.bendPoints||[]).map((W)=>R0(W,J)),R0(q.endPoint,J)];return{...Z,sections:[{...q,startPoint:X[0],bendPoints:X.slice(1,-1),endPoint:X[X.length-1]}]}}).filter(Boolean)});return[...b.map((J)=>{let[Z]=J.sections||[],q=[Z.startPoint,...Z.bendPoints||[],Z.endPoint],X;if(J.sources[0].includes("east")&&J.targets[0].includes("input"))X="east-input";else if(J.sources[0].includes("west"))X="west";else X="other";return{id:J.id,points:q,type:X,sources:J.sources,targets:J.targets}}),...z.map((J)=>{let[Z]=J.sections||[],q=[Z.startPoint,...Z.bendPoints||[],Z.endPoint],X;if(J.sources[0].includes("east")&&J.targets[0].includes("input"))X="east-input";else if(J.sources[0].includes("west"))X="west";else X="other";return{id:J.id,points:q,type:X,sources:J.sources,targets:J.targets}})].flat()},R0=($,b)=>({x:$.x+b.x,y:$.y+b.y});var U3;var M1=K(async()=>{await F();J0();U3=H("graph-meta",{development:!0,description:"Node"}).context(($)=>({id:$.string({title:"ID meta"}),description:$.string({title:"Описание",nullable:!0}),width:$.number({default:0}),height:$.number({nullable:!0}),error:$.string({title:"Ошибка",nullable:!0})})).core(()=>({header:a(),canvas:a(),edges:[]})).reactions({"вычисленное положение":{filter:({meta:$,patch:b})=>$.tag==="graph-layout"&&b.path==="/state"&&b.value==="ожидание",action({context:$,update:b,core:z}){let J=sessionStorage.getItem($.id);if(!J){b({error:"Нет данных разметки"});return}let Z=JSON.parse(J);z.edges=W1(Z),b({width:Z.width,height:Z.height})}}}).states("рендер","позиционирование").transitions("рендер",[{in:"рендер",to:{"позиционирование":{width:{isNull:!1},height:{isNull:!1}}}},{in:"позиционирование",action({element:$,context:b,core:z}){let J=z.header?.value?.getBoundingClientRect();$.style.cssText=`width: ${b.width}px; height: ${b.height+J.height}px;`;let Z=z.canvas.value;if(!Z)return;Z.width=b.width,Z.height=b.height,requestAnimationFrame(()=>{if(!Z||!z.edges.length)return;let q=Z.getContext("2d");if(!q)return;q.clearRect(0,0,Z.width,Z.height),z.edges.forEach((X)=>{q.strokeStyle=X.type==="east-input"?"#9c27b0":X.type==="west"?"#2196f3":"#4caf50",q.lineWidth=2,q.shadowColor="rgba(0,0,0,0.4)",q.shadowBlur=4,q.shadowOffsetY=4,G1(q,X.points,8),q.stroke(),q.closePath()}),q.shadowColor="transparent",q.shadowBlur=0,q.shadowOffsetY=0})},to:{}}]).view({render:({html:$,context:b,core:z,ref:J})=>$`
      <header ${J(z.header)}>
        <div><!--кнопки слева--></div>
        <h2 class="noselect">${b.description||b.id.split("/")[0]}</h2>
        <div><!--кнопки справа-->
          <button aria-label="Редактировать">
            <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor">
              <path
                d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"/>
            </svg>
          </button>
        </div>
      </header>
      <section>
        <slot></slot>
        <canvas ${J(z.canvas)}></canvas>
      </section>
    `,style:({css:$})=>$`
      :host {
        backdrop-filter: var(--backdrop-filter-blur);
        -webkit-backdrop-filter: var(--backdrop-filter-blur);
        -moz-backdrop-filter: var(--backdrop-filter-blur);
        -o-backdrop-filter: var(--backdrop-filter-blur);
        -ms-backdrop-filter: var(--backdrop-filter-blur);

        --font-color: rgb(var(--surface-50));
        --background-color: rgba(var(--surface-100) / calc(var(--background-alpha) * 0.1));

        position: fixed;
        display: flex;
        flex-direction: column;
        user-select: none;
        will-change: transform;
        box-sizing: border-box;
        border-radius: 7px;
        opacity: 0;
        transition: opacity 222ms ease-in-out;

        &:before {
          content: "";
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          position: absolute;
          border: 1px solid rgba(var(--surface-800));
          border-radius: inherit;
          pointer-events: none;
          z-index: -2;
          transition: box-shadow 0.3s ease-in-out;
          box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px, rgba(0, 0, 0, 0.2) 0 -3px 0 inset;
        }

        &:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise' x='0%' y='0%' width='100%' height='100%'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='white' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: contain;
          opacity: 0.1;
          border-radius: inherit;
          z-index: -1;
        }
      }

      :host([state="позиционирование"]) {
        opacity: 1;
      }

      header {
        position: relative;
        padding: 8px 6px;
        z-index: 2;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: rgba(var(--surface-500) / var(--background-alpha));
        box-sizing: border-box;
        user-select: none;
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        font-family: "Russo One", 'Courier New', Courier, monospace;
        cursor: move;

        &::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 12px;
          pointer-events: none;
          z-index: 1;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.18), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
          opacity: 0.7;
        }

        & > div:first-child {
          flex: 1;
          display: flex;
          gap: 4px;
          padding-left: 4px;
        }

        & > h2 {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          flex: 1;
          text-align: center;
          margin: 0;
          padding: 0;
          text-wrap: nowrap;
        }

        & > div:last-child {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          padding-right: 4px;
          gap: 4px;
        }

        button {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          border-radius: 4px;
          color: var(--font-color);

          &:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }

          & svg {
            display: block;
          }
        }
      }

      section {
        display: flex;
        position: relative;
        background-color: var(--background-color);
        border-bottom-right-radius: inherit;
        border-bottom-left-radius: inherit;
        width: 100%;
        height: 100%;

        & canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          display: block;
        }
      }

    `})});var W3;var _1=K(async()=>{await F();W3=H("graph-state",{development:!0}).context(($)=>({id:$.string({title:"ID meta"}),state:$.string({title:"Состояние"}),error:$.string({nullable:!0}),width:$.number({nullable:!0}),height:$.number({nullable:!0}),x:$.number({nullable:!0}),y:$.number({nullable:!0})})).core(()=>({meta:null})).reactions({"вычисленное положение":{filter:({meta:$,patch:b})=>$.tag==="graph-layout"&&b.path==="/state"&&b.value==="ожидание",action({context:$,update:b}){let z=sessionStorage.getItem($.id);if(!z){b({error:"Нет данных разметки"});return}let Z=JSON.parse(z).children.find((q)=>q.id===$.state);if(!Z){b({error:`Состояние ${$.state} не найдено в layout`});return}b({x:Z.x,y:Z.y,width:Z.width,height:Z.height})}}}).states("рендер","изменение размера","перемещение").transitions("рендер",[{in:"рендер",to:{"перемещение":{x:{isNull:!1},y:{isNull:!1}}}},{in:"перемещение",action({element:$,context:b}){$.style.transform=`translate(${b.x}px, ${b.y}px)`},to:{}}]).view({render:({html:$})=>$`
      <slot></slot>
    `,style:({css:$})=>$`
      :host {
        position: relative;
        height: fit-content;
      }
    `})});var Q1=($,b,z)=>{for(let J of b)if(J[0]===$){let q=J[1];return q()}return z?.()};var Q3;var F0=K(async()=>{await F();Q3=H("graph-socket").context(($)=>({id:$.string({title:"ID meta"}),state:$.string({title:"Название состояния"}),param:$.string({title:"Ключ параметра"}),direction:$.enum("west","east")({title:"Вход/Выход"}),parent:$.enum("state","condition")({title:"Принадлежность"}),type:$.enum("string","number","boolean","array","enum")({title:"Тип параметра",default:"string"}),size:$.number({nullable:!0}),x:$.number({nullable:!0}),y:$.number({nullable:!0}),error:$.string({title:"Ошибка",nullable:!0})})).core().reactions({}).states("рендер","измерение").transitions("рендер",[{in:"рендер",action({element:$,context:b}){$.dataset.direction=typeof b.direction!=="undefined"?b.direction==="west"?"input":"output":"",$.dataset.type=b.type||"string"},to:{"измерение":{error:null}}},{in:"измерение",action:({element:$})=>new Promise((b)=>{requestAnimationFrame(()=>{let{width:z,x:J,y:Z}=$.getBoundingClientRect();return b({size:Math.round(z),x:Math.round(J),y:Math.round(Z)})})}),to:{}}]).view({style:({css:$})=>{return $`
        :host {
          position: absolute;
          width: ${12}px;
          height: ${12}px;
          border-radius: 50%;
          border: 1px solid rgb(var(--surface-400));
          background: rgb(var(--surface-600));
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
          --socket-border-color: rgb(var(--surface-900) / 77%);
        }

        :host([data-direction="input"]) {
          left: ${-6}px;
          background: rgb(var(--primary-500));
          border-color: rgb(var(--primary-300));
        }

        :host([data-direction="output"]) {
          right: ${-6}px;
          background: rgb(var(--secondary-500));
          border-color: rgb(var(--secondary-300));
        }

        :host(.connected) {
          background: rgb(var(--success-400));
          border-color: rgb(var(--success-200));
          box-shadow: 0 0 8px rgb(var(--success-400));
        }

        :host(.connected[data-direction="input"]) {
          background: rgb(var(--success-500));
          border-color: rgb(var(--success-300));
        }

        :host(.connected[data-direction="output"]) {
          background: rgb(var(--success-600));
          border-color: rgb(var(--success-400));
        }

        :host(:hover) {
          transform: scale(1.3);
          z-index: 10;
        }

        :host(:active) {
          transform: scale(0.9);
        }

        :host([data-valid="false"]) {
          background: rgb(var(--error-500));
          border-color: rgb(var(--error-300));
        }

        :host([disabled]) {
          opacity: 0.4;
          filter: grayscale(0.3);
        }

        /* Цвета по типам параметров */

        :host([data-type="string"]) {
          background: #6082B6;
          border: 2px solid var(--socket-border-color);
          box-shadow: none;
        }

        :host([data-type="number"]) {
          background: #B6A160;
          border: 2px solid var(--socket-border-color);
          box-shadow: none;
        }

        :host([data-type="boolean"]) {
          background: #60B67A;
          border: 2px solid var(--socket-border-color);
          box-shadow: none;
        }

        :host([data-type="array"]) {
          background: #B660A1;
          border: 2px solid var(--socket-border-color);
          box-shadow: none;
        }

        :host([data-type="enum"]) {
          background: #B66060;
          border: 2px solid var(--socket-border-color);
          box-shadow: none;
        }

        /* Подключенные сокеты по типам */

        :host(.connected[data-type="string"]) {
          background: rgb(var(--primary-500));
          border-color: #fff;
          box-shadow: none;
        }

        :host(.connected[data-type="number"]) {
          background: rgb(var(--secondary-500));
          border-color: #fff;
          box-shadow: none;
        }

        :host(.connected[data-type="boolean"]) {
          background: rgb(var(--warning-500));
          border-color: #fff;
          box-shadow: none;
        }

        :host(.connected[data-type="array"]) {
          background: rgb(var(--tertiary-500));
          border-color: #fff;
          box-shadow: none;
        }

        :host(.connected[data-type="enum"]) {
          background: rgb(var(--error-500));
          border-color: #fff;
          box-shadow: none;
        }
      `}})});var K3;var A1=K(async()=>{await F();K3=H("input-string").context(($)=>({name:$.string({}),title:$.string({}),value:$.string({nullable:!0}),error:$.string({nullable:!0})})).core().reactions({}).states("рендер").transitions("рендер",[]).view({render:({context:$,html:b,update:z})=>b`
      <span>${$.title}</span>
      <input
        type="text"
        name=${$.name}
        value=${$.value}
        @input=${(J)=>z({value:J.target instanceof HTMLInputElement?J.target.value:""})}
      />
    `,style:({css:$})=>$`
      :host {
        display: flex;
        align-items: center;
        min-height: 32px;
        width: 100%;
      }

      span {
        color: var(--font-color);
        font-size: 13px;
        margin: 0 8px;
      }

      input[type="text"] {
        color: var(--font-color);
        background: none;
        border: none;
        border-radius: 13px;
        font-size: 13px;
        padding: 4px 8px;
        outline: none;
        min-width: 40px;
        flex-grow: 1;
        text-align: right;
      }
    `})});var L3;var H1=K(async()=>{await F();L3=H("input-number").context(($)=>({name:$.string({}),title:$.string({}),value:$.string({nullable:!0}),error:$.string({nullable:!0})})).core().reactions({}).states("рендер").transitions("рендер",[]).view({render:({context:$,html:b,update:z})=>b`
      <span>
        ${$.title}
      </span>
      <input 
        type="number" 
        name=${$.name} 
        value=${$.value??""}
        @input=${(J)=>z({value:J.target instanceof HTMLInputElement?J.target.value:""})}
      />
    `,style:({css:$})=>$`
      :host {
        display: flex;
        align-items: center;
        min-height: 32px;
        width: 100%;
      }

      span {
        color: var(--font-color);
        font-size: 13px;
        margin: 0 8px;
      }

      input[type="number"] {
        color: var(--font-color);
        background: none;
        border: none;
        border-radius: 13px;
        font-size: 13px;
        padding: 4px 8px;
        outline: none;
        min-width: 40px;
        text-align: right;
        width: 100%;
      }

      /* Убираем стрелочки для Chrome, Safari, Edge */
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Убираем стрелочки для Firefox */
      input[type="number"] {
        -moz-appearance: textfield;
      }
    `})});var j3;var K1=K(async()=>{await F();j3=H("input-boolean").context(($)=>({name:$.string({}),title:$.string({}),value:$.boolean({nullable:!0}),error:$.string({nullable:!0})})).core().reactions({}).states("рендер").transitions("рендер",[]).view({render:({context:$,html:b,update:z})=>b`
      <span class="param-title">${$.title}</span>
      <label class="switch-vision-pro">
        <input
          type="checkbox"
          name=${$.name}
          .checked=${Boolean($.value)}
          @change=${(J)=>z({value:J.target instanceof HTMLInputElement?J.target.checked:!1})}
        />
        <span class="slider"></span>
      </label>
    `,style:({css:$})=>$`
      :host {
        display: flex;
        align-items: center;
        min-width: 222px;
        min-height: 32px;
        justify-content: space-between;
        width: 100%;
      }

      .param-title {
        color: var(--font-color);
        font-size: 13px;
        margin: 0 8px;
      }

      .switch-vision-pro {
        --switch-width: 44px;
        --switch-height: 20px;
        --switch-knob: 14px;
        
        position: relative;
        display: inline-block;
        width: var(--switch-width);
        height: var(--switch-height);
        margin: 0 8px 0 0;
        vertical-align: middle;
      }

      .switch-vision-pro input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .switch-vision-pro .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, rgba(var(--surface-200), 0.9) 0%, rgba(var(--surface-100), 0.9) 100%);
        border-radius: calc(var(--switch-height) / 1.625);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10), 0 1px 3px rgba(0, 0, 0, 0.08);
        transition: background 0.3s, box-shadow 0.3s;
      }

      .switch-vision-pro input:checked + .slider {
        background: linear-gradient(90deg, #4f8cff 0%, #a6bfff 100%);
        box-shadow: 0 2px 12px #4f8cff44, 0 1.5px 3px #4f8cff22;
      }

      .switch-vision-pro .slider:before {
        content: "";
        position: absolute;
        left: 3px;
        top: 3px;
        width: var(--switch-knob);
        height: var(--switch-knob);
        border-radius: 50%;
        background: white;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.10);
        transition: transform 0.3s cubic-bezier(.4, 2.2, .2, 1), background 0.3s;
      }

      .switch-vision-pro input:checked + .slider:before {
        transform: translateX(calc(var(--switch-width) - var(--switch-knob) - 6px));
        background: #eaf1ff;
      }

      .switch-vision-pro input:focus + .slider {
        box-shadow: 0 0 0 2px #4f8cff55;
      }
    `})});var D3;var V1=K(async()=>{await F();D3=H("input-array").context(($)=>({name:$.string({}),title:$.string({}),value:$.array({default:[""]}),error:$.string({nullable:!0}),input:$.string({default:""})})).core().reactions({}).states("рендер").transitions("рендер",[]).view({render:({context:$,html:b,update:z})=>b`
      <div>
        <span>
          ${$.title}
        </span>
        <div>
          ${$.value.map((J,Z)=>b`
            <span class="chip">
              ${J}
              <button
                title="Удалить"
                @click=${()=>{let q=$.value.slice();q.splice(Z,1),z({value:q})}}
              >
                ×
              </button>
            </span>
          `)}
          <input
            name=${$.name}
            type="text"
            placeholder="Добавить..."
            .value=${$.input}
            @input=${(J)=>z({input:J.target instanceof HTMLInputElement?J.target.value:""})}
            @keydown=${(J)=>{if(J.key==="Enter"&&$.input.trim()){let Z=$.input.trim();if(!$.value.includes(Z))z({value:[...$.value,Z],input:""});else z({input:""})}}}
          />
          <button
            title="Добавить"
            @click=${()=>{let J=$.input.trim();if(J&&!$.value.includes(J))z({value:[...$.value,J],input:""});else z({input:""})}}>
            +
          </button>
        </div>
      </div>
    `,style:({css:$})=>$`
      :host {
        display: flex;
        align-items: center;
        min-height: 32px;
        width: 100%;

        & > div {
          display: flex;
          align-items: center;

          & > span {
            color: var(--font-color);
            font-size: 13px;
            margin: 0 8px;
          }

          & > div {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
            min-width: 80px;
            background: none;
            border-radius: 8px;
            padding: 2px 4px;

            & span {
              display: inline-flex;
              align-items: center;
              background: rgba(var(--surface-200)/ 0.7);
              color: var(--font-color);
              border-radius: 14px;
              padding: 2px 6px 2px 8px;
              font-size: 13px;
              margin: 0 2px;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.06);
              user-select: none;
              transition: background 0.2s;
            }
          }
        }

      }

      button[title="Удалить"] {
        background: none;
        border: none;
        color: rgb(var(--error-900));
        font-size: 1.1em;
        margin-left: 4px;
        cursor: pointer;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        line-height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;

        &:hover {
          background: #ffd6d6;
        }
      }

      input {
        min-width: 40px;
        font-size: 13px;
        border: none;
        outline: none;
        background: none;
        color: var(--font-color);
        padding: 2px 6px;
        border-radius: 8px;
      }

      button[title="Добавить"] {
        background: #eaf1ff;
        border: none;
        color: #2962ff;
        font-size: 1.1em;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        padding: 0;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 2px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #d0e6ff;
        }
      }
    `})});var S3;var O1=K(async()=>{await F();S3=H("input-enum").context(($)=>({name:$.string({}),title:$.string({}),value:$.string({nullable:!0}),options:$.array({default:[]}),error:$.string({nullable:!0})})).core().reactions({}).states("рендер").transitions("рендер",[]).view({render:({context:$,html:b,update:z,repeat:J})=>{return b`
        <span>${$.title}</span>
        <div>
          <select
            name=${$.name}
            @change=${(Z)=>{let q=Z.target instanceof HTMLSelectElement?Z.target.value:"";if(Z.target instanceof HTMLSelectElement)z({value:q})}}>
            ${J($.options,(Z)=>Z,(Z)=>b`
              <option
                value=${Z}
                ?selected=${$.value===Z}
              >
                ${Z}
              </option>
            `)}
          </select>
        </div>
      `},style:({css:$})=>$`
      :host {
        display: flex;
        align-items: center;
        white-space: nowrap;
        width: 100%;
        min-height: 32px;
      }

      span {
        color: var(--font-color);
        font-size: 13px;
        margin: 0 8px;
        white-space: nowrap;
      }

      div {
        position: relative;
        display: inline-block;
        width: 100%;
        min-width: 100px;
      }

      select {
        width: 100%;
        padding: 8px 22px 8px 2px;
        border-radius: 6px;
        border: 1px solid rgba(var(--surface-400), 0.7);
        background: rgba(var(--surface-100), 0.9);
        color: rgb(var(--primary-50));
        font-family: inherit;
        font-size: 1em;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
        direction: rtl;
        text-align: right;

        /* Safari через webkit-specific свойство */

        /*noinspection ALL*/

        &::-webkit-select-placeholder {
          text-align: left;
        }
      }


      select:focus, select:hover {
        border-color: rgb(var(--surface-600));
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
      }

      div::after {
        content: "";
        position: absolute;
        top: 54%;
        right: 4px;
        width: 0;
        height: 0;
        pointer-events: none;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid rgb(var(--surface-600));
        transform: translateY(-50%);
      }
    `})});var m3;var j0=K(async()=>{await F();await F0();await A1();await H1();await K1();await V1();await O1();m3=H("graph-param").context(($)=>({id:$.string({title:"ID meta"}),state:$.string({title:"Название состояния"}),param:$.string({title:"Ключ параметра"}),title:$.string({title:"Название параметра"}),type:$.enum("string","number","boolean","array","enum")({title:"Тип параметра"}),value:$.string({title:"Значение параметра",nullable:!0}),error:$.string({title:"Ошибка",nullable:!0}),width:$.number({nullable:!0}),height:$.number({nullable:!0}),x:$.number({nullable:!0}),y:$.number({nullable:!0}),options:$.array({nullable:!0})})).core(({update:$,context:b})=>{return document.addEventListener("channel",(z)=>{let{detail:J}=z,{meta:Z,patch:q}=J;if(b.id===`${Z.tag}/${Z.index}`&&q.path==="/context"&&Object.hasOwn(q.value,b.param))$({value:q.value[b.param]})}),{meta:null}}).reactions({"изменение значений":{filter:({meta:$,patch:b})=>$.tag.includes("input-")&&b.path==="/context"&&Object.hasOwn(b.value,"value"),action({core:$,context:b,patch:z}){$.meta.update({[b.param]:z.value.value})}}}).states("рендер","измерение","установка положения").transitions("рендер",[{in:"рендер",to:{"измерение":{error:null}}},{in:"измерение",action:({element:$})=>new Promise((b)=>{requestAnimationFrame(()=>{let{width:z,height:J}=$.getBoundingClientRect();b({width:Math.round(z),height:Math.round(J)})})}),to:{"установка положения":{x:{isNull:!1},y:{isNull:!1}}}},{in:"установка положения",to:{}}]).view({render:({context:$,html:b})=>b`
      <metafor-graph-socket context=${{id:$.id,state:$.state,param:$.param,parent:"state",direction:"west",type:$.type}}></metafor-graph-socket>
      ${Q1($.type,[["string",()=>b`
            <metafor-input-string context=${{name:$.param,title:$.title,value:$.value}}
            ></metafor-input-string>`],["number",()=>b`
            <metafor-input-number context=${{name:$.param,title:$.title,value:$.value}}></metafor-input-number>`],["boolean",()=>b`
            <metafor-input-boolean context=${{name:$.param,title:$.title,value:$.value}}></metafor-input-boolean>`],["array",()=>b`
            <metafor-input-array context=${{name:$.param,title:$.title,value:$.value}}></metafor-input-array>`],["enum",()=>b`
            <metafor-input-enum context=${{name:$.param,title:$.title,value:$.value,options:$.options}}></metafor-input-enum>`]],()=>b`
          <span>Неизвестный тип</span>
        `)}
      <metafor-graph-socket context=${{id:$.id,state:$.state,param:$.param,parent:"state",direction:"east",type:$.type}}></metafor-graph-socket>
    `,style:({css:$})=>$`
      :host {
        background-color: rgba(var(--surface-900));
        margin: 2px 0;
        padding: 0 2px;
        display: flex;
        align-items: center;
        border-radius: calc(var(--node-border-radius) / 2);
      }
    `})});var d3;var L1=K(async()=>{J0();await F();await j0();d3=H("graph-context",{description:"Контекст",development:!0}).context(($)=>({id:$.string({title:"ID meta"}),state:$.string({title:"Название состояния"}),error:$.string({title:"Ошибка",nullable:!0}),width:$.number({nullable:!0}),height:$.number({nullable:!0}),x:$.number({nullable:!0}),y:$.number({nullable:!0}),layout:$.boolean({default:!1}),active:$.boolean({default:!1}),process:$.boolean({default:!1})})).core(()=>({params:new Map,sockets:new Map,count:0,header:a(),meta:null})).reactions({"вычисленное положение":{filter:({meta:$,patch:b})=>$.tag==="graph-layout"&&b.path==="/state"&&b.value==="ожидание",action({id:$,context:b,update:z}){let J=sessionStorage.getItem(b.id);if(!J){z({error:"Нет данных разметки"});return}let Z=JSON.parse(J),q=Z.children.find((W)=>W.id===b.state);if(!q){z({error:`Состояние ${b.state} не найдено в layout`});return}let X=q.children.find((W)=>W.id===$);if(!X){z({error:`не найден элемент: ${$} для состояния ${b.state}`}),console.error(`не найден элемент: ${$} для состояния ${b.state}`,Z);return}z({x:X.x,y:X.y,layout:!0})}},"активность состояния":{filter:({meta:$,patch:b,context:z})=>z.id===`${$.tag}/${$.index}`&&b.path==="/state",action:({update:$,patch:b,context:z})=>{if(b.value===z.state)$({process:b.op==="add",active:!0});else $({process:!1,active:!1})}}}).states("рендер","измерение","позиционирование","неактивно","активно","в процессе").transitions("измерение",[{in:"измерение",action:({element:$})=>new Promise((b)=>{requestAnimationFrame(()=>{let{width:z,height:J,x:Z,y:q}=$.getBoundingClientRect();b({width:Math.round(z),height:Math.round(J),x:Math.round(Z),y:Math.round(q)})})}),to:{"позиционирование":{layout:!0}}},{in:"позиционирование",action({element:$,context:b}){$.style.transform=`translate(${b.x}px, ${b.y}px)`},to:{"неактивно":{error:null,active:!1},"активно":{error:null,active:!0}}},{in:"в процессе",to:{"неактивно":{error:null,active:!1,process:!1},"активно":{error:null,active:!0,process:!1}}},{in:"активно",to:{"неактивно":{error:null,active:!1}}},{in:"неактивно",to:{"активно":{error:null,active:!0,process:!1},"в процессе":{error:null,active:!0,process:!0}}}]).view({onMount({core:$,update:b,context:z}){if($.meta)b({active:z.state===$.meta.state}),$.meta.onUpdate((J)=>{}),$.meta.onTransition((J,Z)=>{})},render:({context:$,html:b,ref:z,core:J})=>b`
      <header ${z(J.header)}>
        <h2 class="noselect">${$.state}</h2>
      </header>
      <section>
        <slot>empty</slot>
      </section>
    `,style:({css:$})=>$`
      :host {
        backdrop-filter: var(--backdrop-filter-blur);
        -webkit-backdrop-filter: var(--backdrop-filter-blur);
        -moz-backdrop-filter: var(--backdrop-filter-blur);
        -o-backdrop-filter: var(--backdrop-filter-blur);
        -ms-backdrop-filter: var(--backdrop-filter-blur);

        --background-color: rgba(var(--surface-700) / var(--background-alpha));

        position: fixed;
        display: flex;
        flex-direction: column;
        min-width: max-content;
        border-radius: var(--node-border-radius);
        transition: box-shadow 0.3s ease-in-out;
        box-sizing: border-box;

        &:before {
          content: "";
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          position: absolute;
          border: 1px solid rgba(var(--surface-900) / 1);
          border-radius: inherit;
          pointer-events: none;
          z-index: -2;
          transition: box-shadow 0.3s ease-in-out;
          box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px,
          rgba(0, 0, 0, 0.2) 0 -3px 0 inset;
        }

        &:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise' x='0%' y='0%' width='100%' height='100%'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='white' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: contain;
          opacity: 0.1;
          border-radius: inherit;
          z-index: -1;
        }

        & header {
          padding: 8px 24px;
          background-color: rgba(var(--surface-500) / var(--background-alpha));
          border-radius: var(--node-border-radius);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          position: relative;
          font-weight: 800;
          letter-spacing: 0.02em;
          font-family: "Russo One", "Courier New", Courier, monospace;
          transition: background-color 0.4s, color 0.4s;
          color: rgb(var(--primary-400));
          cursor: move;

          & h2 {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            margin: 0;
          }

          &::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.18), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
            opacity: 0.7;
          }
        }

        & > section {
          background: var(--background-color);
          padding: 8px;
          display: flex;
          flex-direction: column;
          position: relative;
          border-radius: 0 0 var(--node-border-radius) var(--node-border-radius);
          background-color: var(--background-color);
        }
      }

      :host([state="активно"]) {
        &:before {
          box-shadow: 0 0 12px 2px rgb(var(--primary-500) / 0.7);
          border-color: rgb(var(--primary-400));
        }
      }

      :host([state="в процессе"]) {
        &:before {
          box-shadow: 0 0 12px 4px rgb(var(--primary-700));
          animation: process-blink 1.1s ease-in-out infinite;
          border-color: rgb(var(--primary-800));
          border-width: 1px;
        }
      }

      @keyframes process-blink {
        0%,
        100% {
          box-shadow: 0 0 12px 4px rgb(var(--primary-700));
          border-color: rgb(var(--primary-400));
          border-width: 2px;
        }
        50% {
          box-shadow: 0 0 12px 0 rgb(var(--primary-700) / 0.8);
          border-color: rgb(var(--primary-800));
          border-width: 1px;
        }
      }
    `})});var r3;var R1=K(async()=>{await F();T();r3=H("graph-operator",{development:!0}).context(($)=>({id:$.string({title:"ID meta"}),from:$.string({title:"Исходное состояние"}),to:$.string({title:"Текущее состояние"}),title:$.string({title:"Название оператора",nullable:!0}),value:$.string({title:"Значение",nullable:!0}),symbol:$.string({title:"Графический символ",nullable:!0}),op:$.enum("eq","notEq","gt","gte","lt","lte","between","notGt","notGte","notLt","notLte","notMin","notMax","startsWith","endsWith","notStartsWith","notEndsWith","include","notInclude","pattern","includes","length","every","some","logicalEq","not","isNull","notNull")({title:"Операция сравнения",nullable:!0}),error:$.string({title:"Ошибка",nullable:!0})})).core(()=>({operators:{eq:{symbol:"⊜",title:"Равно",description:"Проверяет равенство двух числовых значений"},notEq:{symbol:"≠",title:"Не равно",description:"Проверяет неравенство двух значений"},gt:{symbol:"⊐",title:"Больше",description:"Проверяет, что значение больше указанного числа"},gte:{symbol:"⊒",title:"Больше или равно",description:"Проверяет, что значение больше или равно указанному числу"},lt:{symbol:"⊏",title:"Меньше",description:"Проверяет, что значение меньше указанного числа"},lte:{symbol:"⊑",title:"Меньше или равно",description:"Проверяет, что значение не меньше или равно указанного числа"},between:{symbol:"⋈",title:"Между значениями",description:"Проверяет, что значение находится в указанном диапазоне"},notGt:{symbol:"≯",title:"Не больше",description:"Проверяет, что значение не больше указанного числа"},notGte:{symbol:"≱",title:"Не больше или равно",description:"Проверяет, что значение не больше или равно указанному числу"},notLt:{symbol:"≮",title:"Не меньше",description:"Проверяет, что значение не меньше указанного числа"},notLte:{symbol:"≰",title:"Не меньше или равно",description:"Проверяет, что значение не меньше или равно указанного числа"},notMin:{symbol:"⊀",title:"Не минимальное",description:"Проверяет, что значение не является минимальным"},notMax:{symbol:"⊁",title:"Не максимальное",description:"Проверяет, что значение не является максимальным"},startsWith:{symbol:"⊰",title:"Начинается с",description:"Проверяет, начинается ли строка с указанного значения"},endsWith:{symbol:"⊱",title:"Заканчивается на",description:"Проверяет, заканчивается ли строка указанным значением"},notStartsWith:{symbol:"⋪",title:"Не начинается с",description:"Проверяет, что строка не начинается с указанного значения"},notEndsWith:{symbol:"⋫",title:"Не заканчивается на",description:"Проверяет, что строка не заканчивается указанным значением"},include:{symbol:"⊆",title:"Содержит",description:"Проверяет наличие подстроки в строке"},notInclude:{symbol:"⊈",title:"Не содержит",description:"Проверяет отсутствие подстроки в строке"},pattern:{symbol:"⋊",title:"Регулярное выражение",description:"Проверяет соответствие строки регулярному выражению"},includes:{symbol:"⊂",title:"Содержит элемент",description:"Проверяет наличие элемента в массиве"},length:{symbol:"⊢",title:"Длина массива",description:"Проверяет длину массива"},every:{symbol:"⋀",title:"Все элементы",description:"Проверяет условие для всех элементов массива"},some:{symbol:"⋁",title:"Хотя бы один",description:"Проверяет условие хотя бы для одного элемента массива"},logicalEq:{symbol:"⊨",title:"Логическое равно",description:"Проверяет логическое равенство"},not:{symbol:"⊭",title:"Не равно",description:"Инвертирует логическое значение"},isNull:{symbol:"∅",title:"Проверка на null",description:"Проверяет, является ли значение null или undefined"},notNull:{symbol:"¬∅",title:"Проверка на не null",description:"Проверяет, что значение не является null или undefined"}}})).reactions({}).states("init","ready").transitions("init",[{in:"init",action({context:$,core:b}){if(!$.op)throw new Error("Не установлен в контекст значение параметра op");let z=b.operators[$.op];return{title:z.title,symbol:z.symbol}},to:{ready:{op:{isNull:!1},title:{isNull:!1},symbol:{isNull:!1}}}}]).view({render:({context:$,html:b,state:z})=>z!=="ready"?O:b`
      <span>${$.symbol}</span>
      <span>${String($.value)}</span>
    `,style:({css:$})=>$`
      :host {
        border-radius: var(--node-border-radius);
        background-color: rgb(var(--primary-900));
        display: flex;
        height: 100%;
        gap: 8px;
        padding: 0 8px;

        &:focus-within {
          border-color: rgba(var(--primary-500));
          box-shadow: 0 0 2px 1px rgba(var(--primary-500));
        }
      }

      span {
        display: flex;

        &:nth-child(1) {
          color: #4caf50;
          font-size: x-large;
        }

      }
    `})});var t3;var F1=K(async()=>{await F();await R1();await F0();t3=H("graph-condition",{development:!0}).context(($)=>({id:$.string({title:"ID meta"}),from:$.string({title:"Исходное состояние"}),to:$.string({title:"Текущее состояние"}),param:$.string({title:"Ключ параметра"}),type:$.enum("string","number","boolean","array","enum")({title:"Тип параметра"}),error:$.string({nullable:!0}),width:$.number({nullable:!0}),height:$.number({nullable:!0}),x:$.number({nullable:!0}),y:$.number({nullable:!0})})).core().reactions({"вычисленное положение":{filter:({meta:$,patch:b})=>$.tag==="graph-layout"&&b.path==="/state"&&b.value==="ожидание",action({id:$,context:b,update:z}){let J=sessionStorage.getItem(b.id);if(!J){z({error:"Нет данных разметки"});return}let Z=JSON.parse(J),q=Z.children.find((W)=>W.id===b.to);if(!q){z({error:`Состояние ${b.to} не найдено в layout`});return}let X=q.children.find((W)=>W.id===$);if(!X){z({error:`не найден элемент: ${$}`}),console.error(`не найден элемент: ${$}`,Z);return}z({x:X.x,y:X.y})}}}).states("рендер","измерение","позиционирование").transitions("рендер",[{in:"рендер",to:{"измерение":{error:null}}},{in:"измерение",action:({element:$})=>new Promise((b)=>{requestAnimationFrame(()=>{let{width:z,height:J}=$.getBoundingClientRect();b({width:Math.round(z),height:Math.round(J)})})}),to:{"позиционирование":{x:{isNull:!1},y:{isNull:!1}}}},{in:"позиционирование",action({element:$,context:b}){$.style.transform=`translate(${b.x}px, ${b.y}px)`},to:{}}]).view({render:({html:$,context:b})=>$`
      <metafor-graph-socket
        context=${{id:b.id,state:b.to,param:b.param,type:b.type,parent:"condition",direction:"west"}}
      ></metafor-graph-socket>
      <slot></slot>
      <metafor-graph-socket
        context=${{id:b.id,state:b.to,param:b.param,type:b.type,parent:"condition",direction:"east"}}
      ></metafor-graph-socket>
    `,style:({css:$})=>$`
      :host:before {
        content: "";
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        border-radius: inherit;
        pointer-events: none;
        z-index: -2;
        transition: box-shadow 0.3s ease-in-out;
        box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px, rgba(0, 0, 0, 0.2) 0 0 0 inset;
      }

      :host:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise' x='0%' y='0%' width='100%' height='100%'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='white' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: contain;
        opacity: 0.1;
        border-radius: inherit;
        z-index: -1;
      }

      :host {

        backdrop-filter: var(--backdrop-filter-blur);
        -webkit-backdrop-filter: var(--backdrop-filter-blur);
        -moz-backdrop-filter: var(--backdrop-filter-blur);
        -o-backdrop-filter: var(--backdrop-filter-blur);
        -ms-backdrop-filter: var(--backdrop-filter-blur);

        background-color: rgba(var(--surface-400));
        padding: 4px 8px;
        position: fixed;
        display: flex;
        border-radius: 8px;
        flex-direction: row;
        align-items: center;
        gap: 2px;
        min-width: max-content;
        height: auto;
      }
    `})});var j1={};X0(j1,{default:()=>B2});var B2;var E1=K(async()=>{await F();await X1();await B1();await M1();await _1();await L1();await j0();await F1();B2=H("graph-nodes",{description:"",development:!0}).context(($)=>({error:$.string({title:"Ошибка",nullable:!0}),queue:$.array({title:"Очередь акторов для добавления"})})).core().reactions({"Блокировка всплытия":{filter:()=>!0,block:!0,action(){}},"получение списка добавляемых акторов":{filter:({meta:$,patch:b})=>$.tag==="graph-listener"&&b.path==="/context"&&b.value.op==="add"&&b.value.nodes?.length,action({meta:$,patch:b}){}}}).states("render","центрирование одной ноды").transitions("render",[{in:"render",to:{"центрирование одной ноды":{error:null,queue:{length:1}}}},{in:"центрирование одной ноды",to:{render:{error:{isNull:!1}}}}]).view({render:({html:$})=>$`
      <metafor-graph-layout>
        <metafor-graph-listener/>
      </metafor-graph-layout>
    `,style:({css:$})=>$`
      :host {
        color: rgb(var(--surface-50));
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
      }
    `})});await F();await E1().then(() => j1);var W4=H("roadmap",{description:"MetaFor roadmap",development:!1}).context(($)=>({status:$.enum("start","end")({title:"Статус",default:"end"}),error:$.string({title:"Ошибка",nullable:!0})})).core().reactions({}).states("конец","начало").transitions("начало",[{in:"начало",action:()=>new Promise(($)=>{setTimeout(()=>{$({status:"end"})},6000)}),to:{"конец":{status:"end"}}},{in:"конец",to:{"начало":{status:"start"}}}]).view({});
