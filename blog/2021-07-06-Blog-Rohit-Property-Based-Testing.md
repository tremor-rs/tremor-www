---
title: Property Based Testing of Tremor Script
author: Rohit Dandamudi
author_title: Tremor 2021 Spring Mentee
author_url: https://www.linkedin.com/in/kurious-diru/
tags: [testing, mentorship, cncf, tremorscript]
draft: false
hide_table_of_contents: false
description: Rohit's Experience working with Tremor as a LFX Spring 2021 Mentee.
---

### Introduction

Hey, I am [Rohit Dandamudi](https://www.linkedin.com/in/kurious-diru/) from India, about to complete my undergrad in CSE and will be working as a Software Engineer soon. I will be sharing my expereince at Tremor :)

### Main motivation for applying

My work involved writing "Property-based tests for tremor-script" and some of the reasons for applying are:

- It involved a new type of testing I never heard of
- Be part of a sandbox project where I can learn and grow with the community
- The concept of learning Erlang + Rust was very interesting to me and frankly out of my comfort zone, as a person used to Python and web development in general.

### New concepts I learned specific to my work

<!-- alex ignore his -->
- Erlang and Rust
    - My work mostly revolved around Erlang and a little Rust and I was completely new to this ecosystem, it didn't help to not find much resources or actively accessible community for Erlang.
    - I took this as a challenge and went through [various resources to learn Erlang](https://github.com/diru1100/learn_erlang), functional programming in general and I was able to see why this Language was involved to do the task at hand, [my mentor](https://twitter.com/heinz_gies) is very passionate about Erlang and shared his thought-process, experience which helped me broaden my knowledge and how to approach any concept while learning something completely new.

<!--truncate-->

- Tremor-script
    - It is an interpreted expression-oriented language designed for the filtering, extraction, transformation and streaming of structured data in a stream or event-based processing system which is explicitly turing incomplete used to write programs specific to Tremor use-cases.
    - It is written using Rust but tested using Erlang
- Property based testing
    - We have seen various types of testing approaches like Unit testing, Integration testing, End2End testing etc.
    - The purpose of tests is to check if our code is failing anywhere and test the same with various inputs.
    - Fig 1 shows different types of tests to help understand which features are specialised in what.

        ![](/img/blog-images/LFC-blog-diru/tests-comparison-graph.png)

        Fig 1. Showing various tests wrt Feature compilance and Input scope covered [1]

    - Property based testing takes a new appraoch which has the right balance of randomness and examples. They also have this nice feature of called shrinking which shows a simplified version of sample input which is failing your tests. However, Property based testing is not an ideal solution to use everywhere but it fits our use-case here i.e testing features of a custom-language.
    - Some of the resources I kept below may help understand Property based testing better

### Property Based testing in tremor-script

- Property based testing is implemented using [EQC](http://quviq.com/documentation/eqc/)
- Quickcheck is the original library written for Haskell to do property based testing ( similar to xUnit for unit-tests) and EQC is the Erlang version of it
- Erlang quickcheck or EQC is the version used here
    - Implemented by QuviQ
    - Free version is [quickcheck mini](http://www.quviq.com/downloads/)
- Components in Property based test
    - Property is an abstraction of a test case
    - Properties are written in erlang in tremor
- The files shown in Fig 2 make the [eqc part of Tremor](https://github.com/tremor-rs/tremor-runtime/tree/main/tremor-script/eqc)

    ![](/img/blog-images/LFC-blog-diru/eqc-files.png)

    Fig 2. Files related to eqc

    - **gen_script:** This file contains functions which create the structure of the expected expression for a partticular feature/operation that we will be testing in tremor-script
    - **model.erl:** Here, we run the model specification of each operation implemented in Erlang natively.
    - **pbt.erl:** Some supporting headers needed by other files
    - **spec.erl:** We make use of EQC functions here to create the input generators to test a feature.
    - **test_eqc.erl:** The main property of the property based test is kept here.
    - **util.erl:** Utility functions to support operations for easier handling.
- On a high level Fig 3 explains how the property we consider is checked

![](/img/blog-images/LFC-blog-diru/tremor-script-testing-workflow.png)

Fig 3. Highlevel overview of Property based testing in termor-script

### Example thought process

- Here, I will explain about property based testing by going through a step-by-step approach on how a Property based test is written for an operation in termor-script
- [Patch](docs/0.11/tremor-script/index#patch) is a operation in tremor-script that is performed on Expressions(everthing in tremor-script is an expression :p ) which contains multiple record(data-type) level field operations to be applied to a target record in order to transform a targetted record.
- As patch has multiple operations inside it which have to be seperately created in every step, here is where the concept of incremental implementation comes into picture, if one makes sures if the PatchOperation is implemented before, we can take advantage of that here. For example: Merge is a seperate operation on records but it also is one of the patch operation.
- gen_script.erl: The following code creates the structure needed for a patch operation as shown in Fig 4.

    ![](/img/blog-images/LFC-blog-diru/patch-structure.png)

    Fig 4. Diagram showing Patch operation [4]

    ```erlang
    %% the input are 'patch' keyword, an Expression 
    %% and the Operation to be performed
    gen_({patch, Expr, PatchOperation}) ->
        ["(", "patch ", gen_(Expr), " of ",
         lists:join(",",
    		[[patch_operation(Operation)]
    		 || Operation <- PatchOperation]),
         " end", ")"];
    ```

- model.erl:
    - One of the ast_eval function in this file matches with patch_operation where the following input is passed  ```{patch, Expr, PatchOperation}```.
    - An anonymous function is there to update the PatchOperatoin into the respective structure needed for us to evaluate.
    - At the end we take advantage of floding in lists to implemente the Erlang implementation to get the required output.

    ```erlang
    % Operations covered by the folowing patch_operation are
    % {merge, Value}
    % {merge, Key, Value}
    % {insert, Key, Value}
    % {upsert, Key, Value}
    % {update, Key, Value}
    % {erase, Key}

    patch_operation({insert, Key, Value}, Acc) ->
        maps:put(Key, Value, Acc);
    patch_operation({merge, Key, Value}, Acc) ->
        maps:fold(fun combine_values/3, #{Key => Value}, Acc);
    patch_operation({upsert, Key, Value}, Acc) ->
        % does what we expect from upsert
        maps:put(Key, Value, Acc);
    patch_operation({erase, Key}, Acc) ->
        maps:remove(Key, Acc).

    -spec ast_eval(#vars{}, {}) -> {#vars{},
    				integer() | float() | boolean() | binary()}.

    ast_eval(#vars{} = S, {patch, Expr, PatchOperation}) ->
        {_, ExprUpdate} = ast_eval(S, Expr),
        UpdatdPatchOperation = lists:map(fun ({erase, Key}) ->
    					     {_, UpdatedKey} = ast_eval(S, Key),
    					     {erase, UpdatedKey};
    					 ({merge, Key}) ->
    					     {_, UpdatedKey} = ast_eval(S, Key),
    					     {merge, UpdatedKey};
    					 ({insert, Key, Value}) ->
    					     {_, UpdatedKey} = ast_eval(S, Key),
    					     {_, UpdatedValue} = ast_eval(S,
    									  Value),
    					     {insert, UpdatedKey, UpdatedValue};
    					 ({upsert, Key, Value}) ->
    					     {_, UpdatedKey} = ast_eval(S, Key),
    					     {_, UpdatedValue} = ast_eval(S,
    									  Value),
    					     {upsert, UpdatedKey, UpdatedValue};
                         ({update, Key, Value}) ->
    					     {_, UpdatedKey} = ast_eval(S, Key),
    					     {_, UpdatedValue} = ast_eval(S,
    									  Value),
    					     {update, UpdatedKey, UpdatedValue};
    					 ({merge, Key, Value}) ->
    					     {_, UpdatedKey} = ast_eval(S, Key),
    					     {_, UpdatedValue} = ast_eval(S,
    									  Value),
    					     {merge, UpdatedKey, UpdatedValue};
    					 (X) -> X
    				     end,
    				     PatchOperation),
        {S,
         lists:foldl(fun patch_operation/2, ExprUpdate,
    		 UpdatdPatchOperation)};
    ```

- spec.erl:
    - The randomised input that we provide to test patch-feature comes from here, patch falls as a unary operation which can be performed on a records and has sub operations.
    - The randomisation is obtained by the frequency function we calls different generators.

    ```erlang
    % Operations generated by patch_operation
    % {merge, Value}
    % {merge, Key, Value}
    % {insert, Key, Value}
    % {upsert, Key, Value}
    % {update, Key, Value}
    % {erase, Key}
    patch_operation(S, N) ->
        frequency([{1,
    		{insert, spec_inner_string(S, N - 1),
    		 spec_inner_no_float(S, N - 1)}},
    	       {1,
    		{upsert, spec_inner_string(S, N - 1),
    		 spec_inner_no_float(S, N - 1)}},
    		 {1,
    		{update, spec_inner_string(S, N - 1),
    		 spec_inner_no_float(S, N - 1)}},
    	       {1,
    		{merge, spec_inner_string(S, N - 1),
    		 spec_inner_record(S, N - 1)}},
    	       {1, {erase, spec_inner_string(S, N - 1)}},
    		   {1, {merge, spec_inner_string(S, N - 1)}}]).

    % spec_uop_record function returns {patch, generated_record, patch_operations}
    spec_uop_record(S, N) when N =< 1 ->
        ?SHRINK({patch, literal_record(S, N - 1),
    	     ?SUCHTHAT(X, (list(1, patch_operation(S, N - 1))),
    		       (length(X) >= 1))},
    	    [literal_record(S, N - 1)]);
    spec_uop_record(S, N) ->
        ?SHRINK({patch, spec_inner_record(S, N - 1),
    	     ?SUCHTHAT(X, (list(1, patch_operation(S, N - 1))),
    		       (length(X) >= 1))},
    	    [spec_inner_record(S, N - 1)]).	
    ```

### Ending thoughts and future plans:

All in all, I had/will have wonderful time at Tremor. Over the past 3-months I learned how to learn new tech-stack, got developer wisdom and understood what truely working as a team is. I want to thank Heinz, Matthias, Darach and Ana for making it fun, collaborative and inclusive environment. Although, I didn't had a lot of knowledge in this area before, I am now confident I have the right mindset to pickup new things and grow together with the team.

I would like to continue contributing to the project and explore the rust part of it more. Apart from that I want to take more responsibilty, engage with new-comers and be part of other CNCF community events.

---

### Other resources I compiled while going through the mentorship which y'all might find useful 🙂

1. [Introduction to Property Based Testing](https://medium.com/criteo-engineering/introduction-to-property-based-testing-f5236229d237)
2. [Why isn't functional programming the norm](https://www.youtube.com/watch?v=QyJZzq0v7Z4)
3. [https://github.com/kurious-diru/learn_rust](https://github.com/kurious-diru/learn_rust)
4. [Tremor script patch](docs/0.11/tremor-script/index#patch)
5. Better to use tools: 
    - * cat - bat - [https://github.com/sharkdp/bat](https://github.com/sharkdp/bat)
    - * grep - ripgrep - [https://github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep)
    - * top - htop - [https://github.com/hishamhm/htop](https://github.com/hishamhm/htop)
    - * hexdump - hexyl - [https://github.com/sharkdp/hexyl](https://github.com/sharkdp/hexyl)
6. Related to EQC:
    - [https://www.erlang-factory.com/upload/presentations/19/quickchecktutorial_tartsjhughes.pdf](https://www.erlang-factory.com/upload/presentations/19/quickchecktutorial_tartsjhughes.pdf)
    - Resources mentioned in this issue [https://github.com/tremor-rs/tremor-runtime/issues/721](https://github.com/tremor-rs/tremor-runtime/issues/721)
