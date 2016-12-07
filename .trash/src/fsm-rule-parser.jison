%lex

%s INITIAL INCOMMENT

/** identifiers **/
identifier                              ([\w\*])+

keywords                                "@define" | "@start"

symbols                                 "=>"|"("|")"|"{"|"}"|","|";"

/** comments **/
comments                                "#"[^\n]*

/** whitespaces **/
whitespaces                             ([\ \t\f\n])+

/** regexp **/
regexp                                  "/"([^\\\n\`]|\\.)+?"/"

%%

<<EOF>>                                 return 'EOF'
{whitespaces}                           /** skip **/
{comments}                              /** skip **/
{keywords}                              return yytext
{symbols}                               return yytext
{identifier}                            return 'NAME'
{regexp}                                {
                                          yytext = yytext.slice(1, -1)
                                          return 'REGEXP'
                                        }

/lex

%start fsm_rule_file

%%

/**  FSM **/

fsm_rule_file
  : fsm_rule EOF                        { return $1 }
  ;

fsm_rule
  : '@define' state_list ';'
    '@start' state ';'
    fsm_rule_body                       { $$ = {define: $2, start: $5, body: $7 }
    }
  ;

fsm_rule_body
  : fsm_rule_body fsm_rule_field ';'    { $$ = $1.concat([$2]); }
  | fsm_rule_field ';'                  { $$ = [$1] }
  ;

fsm_rule_field
  : first input '=>' second             { $$ = [$1, $2, $4] }
  ;

state_list
  : state_list ',' state                { $$ = $1.concat([$3]) }
  | state                               { $$ = [$1] }
  ;

first
  : state                               { $$ = $1 }
  | REGEXP                              { $$ = new RegExp($1) }
  ;

second
  : state ;

input
  : '(' NAME ')'                        { $$ = $2 }
  ;

state
  : NAME                                { $$ = $1 }
  ;
